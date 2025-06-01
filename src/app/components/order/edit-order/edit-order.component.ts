import { Component, HostListener, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { ShopService } from '../../../services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { WebstorgeService } from '../../../services/web-storage.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss'
})

export class EditOrderComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile: boolean = false;

  showFiller = false;
  isVAT = false;
  totalVatAmount = 0.00;
  subTotal = 0.00;
  netTotal = 0.00;
  deliveryCharges = 0.00;
  discountAmount = 0.00;
  grandTotal = 0.00;
  discountPercentage = 10.00;
  vatPercentage = 20.00;
  grandTotalWithVAT = 0.00;
  grandTotalWithOutVAT = 0.00;

  cartItems: any[] = [];
  isCartView = false;
  isMainView = true;
  isDisplayCatgories = true;
  isDisplaySubCatgories = false;
  isDisplayProducts = false;
  categories: any[] = [];
  subCategories: any[] = [];
  products: any[] = [];
  totalProducts: any[] = [];
  shopId: any = null;
  orderId: any = null;
  shippingAddress: any = null;
  selectedProduct: any = null;
  isDisplayProductDetails = false;
  isAdmin = false;
  userRole = '';

  constructor(
    private orderService: OrderService,
    private lookupService: LookupService,
    private shopService: ShopService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private webstorgeService: WebstorgeService,
  ) {
    this.checkScreenSize();
  }

  displayedColumns: string[] = [
    'productName',
    'productCode',
    'quantity',
    'salePrice',
    'netAmount',
    'vatAmount',
    'total',
    'action'
  ];

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
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
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.userRole = this.webstorgeService.getUserRole();
    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin') {
      this.isAdmin = true;
    }
    this.orderService.getShoppingPageDetails().subscribe((res) => {
      res.data?.categories?.forEach((category: any) => {
        category.image = environment.backend.host + '/' + category.image;
        category.subCategories?.forEach((subCategory: any) => {
          subCategory.image = environment.backend.host + '/' + subCategory.image;
        });
      });
      this.categories = res.data.categories;
    });

    if (this.orderId) {
      this.orderService.getById(this.orderId).subscribe((res) => {
        this.shopId = res.data.shopId;
        this.cartItems = res.data.items;
        this.deliveryCharges = res.data.deliveryCharges;
        this.vatPercentage = res.data.vatPercentage;
        this.discountPercentage = res.data.discountPercentage;
        this.isVAT = res.data.isVAT;
        this.cartItems.forEach((e: any) => {
          e.netAmount = e.qty * e.salePrice;
          e.vatAmount = (e.netAmount * this.vatPercentage) / 100;
          e.productImage = environment.backend.host + '/' + e.productImage;
        });

        this.updateCalculations();
        this.isCartView = true;
        this.isMainView = false;
      });
    }
  }

  loadProducts(categoryId: number, subCategoryId: number) {
    this.isDisplayProducts = true;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = false;
    this.isCartView = false;
    this.isMainView = true;
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
    this.subCategories = item.subCategories;
  }

  addToCart(item: any): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.productId === item.productId);

    if (!existingItem) {
      item.netAmount = Number(item.qty) * item.salePrice;
      item.vatAmount = (item.netAmount * this.vatPercentage) / 100;
      this.cartItems.push(item);
    }
    this.updateCalculations();
  }

  updateCartItemQuantity(item: any, newQuantity: any): void {

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
    existingItem.netAmount = Number(existingItem.qty) * existingItem.salePrice;
    existingItem.vatAmount = (existingItem.netAmount * this.vatPercentage) / 100;
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
    sessionStorage.setItem('editcartItems', JSON.stringify(this.cartItems));
  }

  loadCartFromSession(): void {
    const savedCart = sessionStorage.getItem('editcartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCalculations();
    }
  }

  updateCalculations() {
    this.subTotal = 0;
    this.netTotal = this.cartItems?.reduce((total, product) => total + product.netAmount, 0) || 0;

    this.discountAmount = (this.netTotal * this.discountPercentage) / 100;
    this.totalVatAmount = (this.netTotal - this.discountAmount) * this.vatPercentage / 100;
    this.subTotal = this.netTotal + this.totalVatAmount;
    this.grandTotalWithVAT = (this.netTotal + this.totalVatAmount + this.deliveryCharges) - this.discountAmount;
    this.grandTotalWithOutVAT = this.netTotal + this.deliveryCharges - this.discountAmount;
    this.grandTotal = this.grandTotalWithVAT;
    this.saveCartToSession();
  }

  continueShopping(): void {
    this.isCartView = false;
    this.isMainView = true;
    this.isDisplayCatgories = true;
    this.isDisplaySubCatgories = false;
    this.isDisplayProducts = false;
    window.scrollTo(0, 0);
  }

  updateOrder(): void {
    const requestBody = {
      orderId: this.orderId,
      shopId: this.shopId,
      shippingAddress: this.shippingAddress,
      items: this.cartItems,
      itemTotal: this.netTotal,
      vatAmount: this.totalVatAmount,
      deliveryCharges: this.deliveryCharges,
      discountAmount: this.discountAmount,
      totalWithVATAmount: this.grandTotalWithVAT,
      totalWithOutVATAmount: this.grandTotalWithOutVAT,
      vatPercentage: this.vatPercentage,
      discountPercentage: this.discountPercentage,
    };
    this.orderService.update(requestBody).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Updated Successfully.");
        this.cartItems = [];
        setTimeout(() => this.closeWindow(), 2000);
        //window.close();
      }
      else {
        this.toasterService.showMessage(res.message);
      }
    });

  }

  closeWindow() {
    window.close();  // Attempt to close the window/tab
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

  viewProductDetails(item: any): void {
    this.isDisplayProductDetails = true;
    this.isCartView = false;
    this.isMainView = false;
    this.selectedProduct = item;
  }

  loadNewArrivals() {
    this.isDisplayProducts = true;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = false;
    this.isCartView = false;
    this.isMainView = true;
    this.isDisplayProductDetails = false;
    this.orderService.loadNewArrivals().subscribe((res) => {
      res.data?.forEach((e: any) => e.productImage = environment.backend.host + '/' + e.productImage);
      this.products = res.data;
      this.products?.forEach(e => e.salePrice = e.productPrices[0].salePrice);
    });
    this.closeSidebar();
  }

}
