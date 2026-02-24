import { Component, HostListener, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { ToasterService } from '../../../services/toaster.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-agent-sim-order',
  templateUrl: './agent-sim-order.component.html',
  styleUrl: './agent-sim-order.component.scss'
})

export class AgentSimOrderComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile: boolean = false;

  showFiller = false;
  subTotal = 0.00;
  shippingAddress = '';
  isEditAddress = false;

  cartItems: any[] = [];
  isCartView = false;
  isDisplayCatgories = true;
  isDisplaySubCatgories = false;
  isDisplayProducts = false;
  categories: any[] = [];
  subCategories: any[] = [];
  products: any[] = [];
  totalProducts: any[] = [];
  paymentMethodLookup: any[] = [];
  agentId: any = null;
  selectedProduct: any = null;
  isDisplayProductDetails = false;
  isMainView = true;


  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private toasterService: ToasterService,
    private webstorgeService: WebstorgeService,
    private route: ActivatedRoute,
  ) {
    this.checkScreenSize();
  }

  displayedColumns: string[] = [
    'productName',
    'productCode',
    'salePrice',
    'quantity',
    'amount',
    'action'
  ];

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1200;
    this.closeSidebar();
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidenav?.close();
    }
  }

  ngAfterViewInit() {
    // Ensure sidenav updates correctly after view initialization
    setTimeout(() => {
      this.sidenav.opened = !this.isMobile;
    });
  }

  ngOnInit(): void {
    this.agentId = this.webstorgeService.getUserInfo().userId;
    this.orderService.getShoppingPageDetails().subscribe((res) => {
      let categories = res.data?.categories.filter((c: any) => c.categoryName == 'SIMS & Stands');
      categories?.forEach((category: any) => {
        category.image = environment.backend.host + '/' + category.image;
        category.subCategories?.forEach((subCategory: any) => {
          subCategory.image = environment.backend.host + '/' + subCategory.image;
        });
      });
      this.categories = categories;
    });

    this.userService.getUser(this.agentId).subscribe((res) => {
      this.shippingAddress = res.data?.user.address;
    });
  }


  loadProducts(categoryId: number, subCategoryId: number) {
    this.isDisplayProducts = true;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = false;
    this.isCartView = false;
    this.isMainView = true;
    this.isDisplayProductDetails = false;
    this.orderService.getProductList(categoryId, subCategoryId).subscribe((res) => {
      res.data?.forEach((e: any) => e.productImage = environment.backend.host + '/' + e.productImage);
      this.products = res.data;
      this.products?.forEach(e => e.salePrice = e.productPrices[0].salePrice);
    });
    this.closeSidebar();
  }

  loadSubCategories(item: any) {
    this.isDisplayProducts = false;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = true;
    this.isCartView = false;
    this.isMainView = true;
    this.isDisplayProductDetails = false;
    this.subCategories = item.subCategories;
  }

  addToCart(item: any): void {
    if (item.qty == 0 || item.qty == null || item.qty == undefined) {
      item.qty = 1;
    }
    const existingItem = this.cartItems.find(cartItem => cartItem.productId === item.productId);

    if (!existingItem) {
      item.amount = Number(item.qty) * item.salePrice;
      this.cartItems.push(item);
    }
    this.updateCalculations();
  }

  increaseQuantity(item: any) {
    if (item.qty == undefined) {
      item.qty = 1;
    }
    else if (item.qty > 0)
      item.qty++;
  }

  decreaseQuantity(item: any) {
    if (item.qty > 0) {
      item.qty--;
    }
  }

  updateCartItemQuantity(item: any, newQuantity: any): void {
    if (newQuantity < 1) {
      this.toasterService.showMessage("Quantity cannot be less than 1.");
      return;
    }
    newQuantity = Number(newQuantity);
    const existingItem = this.cartItems.find(cartItem => cartItem.productId === item.productId);
    existingItem.qty = newQuantity;
    let prodPrice = item.productPrices.filter((f: any) => newQuantity >= f.fromQty && newQuantity <= f.toQty);
    if (prodPrice != null && prodPrice.length > 0) {
      existingItem.salePrice = prodPrice[0].salePrice;
    }
    else {
      existingItem.salePrice = item.productPrices[item.productPrices.length - 1].salePrice;
    }
    existingItem.amount = Number(existingItem.qty) * existingItem.salePrice;
    this.updateCalculations();
  }

  removeCartItem(item: any): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.productId !== item.productId);
    this.updateCalculations();
  }


  viewCart(): void {
    this.isCartView = true;
    this.isMainView = false;
    this.isDisplayProductDetails = false;
    this.updateCalculations();
  }

  saveCartToSession(): void {
    sessionStorage.setItem('simcartItems', JSON.stringify(this.cartItems));
  }

  loadCartFromSession(): void {
    const savedCart = sessionStorage.getItem('simcartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCalculations();
    }
  }

  updateCalculations() {
    this.subTotal = 0;
    this.cartItems?.forEach((product) => {
      this.subTotal += product.qty * product.salePrice;
    });
    this.saveCartToSession();
  }

  continueShopping(): void {
    this.isCartView = false;
    this.isMainView = true;
    this.isDisplayProductDetails = false;
    this.isDisplayCatgories = true;
    this.isDisplaySubCatgories = false;
    this.isDisplayProducts = false;
    window.scrollTo(0, 0);
  }

  createOrder(): void {
    const requestBody = {
      orderId: null,
      agentId: this.agentId,
      items: this.cartItems,
      itemTotal: this.subTotal,
      requestType: 'SimRequest',
      paymentMethodId: 8,
      placedBy: this.agentId,
      shippingAddress: this.shippingAddress,
    };

    if (this.cartItems == null || this.cartItems.length == 0) {
      this.toasterService.showMessage("Your cart is empty, please add some products to place an order.");
    }
    else {
      this.orderService.create(requestBody).subscribe((res) => {
        if (res.statusCode == 201) {
          this.toasterService.showMessage("Sim Request created successfully.");
          this.cartItems = [];
          setTimeout(() => this.closeWindow(), 2000);
          //window.close();
        }
        else {
          this.toasterService.showMessage(res.message);
        }

      });
    }
  }

  closeWindow() {
    window.close();  // Attempt to close the window/tab
  }

  editAddress(): void {
    this.isEditAddress = true;
  }

  updateAddress(): void {
    const requestBody = {
      agentId: this.agentId,
      shippingAddress: this.shippingAddress,
    };

    this.userService.updateAddress(requestBody).subscribe((res) => {
      this.toasterService.showMessage("Address updated successfully.");
      this.isEditAddress = false;
    });
  }

  viewProductDetails(item: any): void {
    this.isDisplayProductDetails = true;
    this.isCartView = false;
    this.isMainView = false;
    this.selectedProduct = item;
  }

  onBackFromDetails() {
    this.isDisplayProductDetails = false;
    this.isDisplayProducts = true;
    this.isMainView = true;
    this.isCartView = false;
  }

}
