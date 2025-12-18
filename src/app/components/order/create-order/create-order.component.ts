import { Component, HostListener, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { LookupService } from '../../../services/lookup.service';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import { ToasterService } from '../../../services/toaster.service';
import { OnFieldService } from '../../../services/on-field.service';
import { ShopService } from '../../../services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { WebstorgeService } from '../../../services/web-storage.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})

export class CreateOrderComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile: boolean = false;
  seachProduct = '';
  showFiller = false;
  isLoading = false;
  commissionAmount = 0.00;
  minimumCartAmount = 25.00;
  totalVatAmount = 0.00;
  subTotal = 0.00;
  netTotal = 0.00;
  deliveryCharges = 2.99;
  discountAmount = 0.00;
  grandTotal = 0.00;
  discountPercentage = 0.00;
  vatPercentage = 20.00;
  grandTotalWithVAT = 0.00;
  grandTotalWithOutVAT = 0.00;
  isEditAddress = false;
  isAddressUpdated = false;
  isHideTemporarly = false;
  availableCommissionChequeNumbers: any[] = [];

  cartItems: any[] = [];
  isMainView = true;
  isCartView = false;
  isDisplayCatgories = true;
  isDisplaySubCatgories = false;
  isDisplayProducts = false;
  categories: any[] = [];
  subCategories: any[] = [];
  products: any[] = [];
  totalProducts: any[] = [];
  paymentMethodLookup: any[] = [];
  selectedPaymentMethodId = null;
  shopId: any = null;
  shopCommissionId: any = null;
  shippingAddress: any = null;
  shopEmail: any = null;
  shopPhone: any = null;
  walletAmount = 0;
  shopDetails: any = null;
  requestType: string | null = null;
  isVAT = false;
  selectedProduct: any = null;
  isDisplayProductDetails = false;
  isAdmin = false;
  userRole = '';
  isRedemed = false;

  includedPaymentMethods = [
    "Against Commission",
    "Cash on delivery",
    "Sell or Return",
    "Return Goods"
  ];

  constructor(
    private orderService: OrderService,
    private lookupService: LookupService,
    private shopService: ShopService,
    private commissionStatementService: CommissionStatementService,
    private toasterService: ToasterService,
    private onFieldService: OnFieldService,
    private webstorgeService: WebstorgeService,
    private route: ActivatedRoute,
  ) {
    this.checkScreenSize();
  }

  displayedColumns: string[] = [
    'productName',
    'productCode',
    'quantity',
    'salePrice',
    'netAmount',
    //'total',
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
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.requestType = this.route.snapshot.paramMap.get('type');
    this.userRole = this.webstorgeService.getUserRole();
    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin') {
      this.isAdmin = true;
    }
    this.isLoading = true;
    if (this.requestType == 'COD') {
      this.isVAT = true;
      this.minimumCartAmount = environment.codMinimumCartValue;
      this.shopId = id;
      this.onFieldService.onFieildCommissionWalletAmounts(this.shopId).subscribe((res) => {
        if (res.data != null) {
          this.commissionAmount = res.data?.outstandingCommissionAmount;
          // if (this.commissionAmount > 0) {
          //   this.loadAvailableCheques();
          // }
        }
      });
    }
    else if (this.requestType == 'MC') {
      this.shopCommissionId = id;
      this.minimumCartAmount = this.commissionAmount;
      this.deliveryCharges = 0.00;
      this.vatPercentage = 0.00;
      this.isVAT = false;
      this.getCommissionHistoryDetails();
    }

    else if (this.requestType == 'B') {
      this.minimumCartAmount = environment.bonusMinimCartValue;
      this.isVAT = true;
      this.shopId = id;

      this.getBonusAmount();
    }

    else if (this.requestType == 'IB') {
      this.shopId = id;
    }


    this.orderService.getShoppingPageDetails().subscribe((res) => {
      res.data?.categories?.forEach((category: any) => {
        category.image = environment.backend.host + '/' + category.image;
        category.subCategories?.forEach((subCategory: any) => {
          subCategory.image = environment.backend.host + '/' + subCategory.image;
        });
      });
      this.categories = res.data.categories;
      //res.data?.products?.forEach((e: any) => e.productImage = environment.backend.host + '/' + e.productImage);
      //this.totalProducts = res.data.products;
    });

    this.lookupService.getOrderPaymentTypes().subscribe((res) => {
      let paymentTypes = res.data;
      if (this.requestType == 'B') {
        this.selectedPaymentMethodId = paymentTypes.find((f: any) => f.name == "Bonus").id;
      }
      else if (this.requestType == 'MC') {
        this.selectedPaymentMethodId = paymentTypes.find((f: any) => f.name == "Monthly Commission").id;
      }
      else {
        this.paymentMethodLookup = paymentTypes.filter(
          (f: any) => this.includedPaymentMethods.includes(f.name)
        );
      }

    });

    if (this.shopId) {
      this.getShopDetails(this.shopId);
    }
    this.loadCartFromSession();
  }

  private getShopDetails(shopId: number): void {
    this.shopService.getShop(shopId).subscribe((res) => {
      this.shopDetails = res.data.shop;
      this.shippingAddress = `${this.shopDetails.addressLine1}, ${res.data.shop.postCode}, London, UK`;
      this.shopEmail = this.shopDetails.shopEmail;
      this.shopPhone = this.shopDetails.shopPhone;
      this.isLoading = false;
    });
  }

  getBonusAmount(): void {
    this.onFieldService.onFieildCommissionWalletAmounts(this.shopId).subscribe((res) => {
      if (res.data != null) {
        this.commissionAmount = res.data?.outstandingBonusAmount;
      }
    });
  }

  getCommissionHistoryDetails(): void {
    this.commissionStatementService.getCommissionHistoryDetails(this.shopCommissionId).subscribe((res) => {
      this.isRedemed = res.data?.isRedemed;
      this.commissionAmount = res.data?.commissionAmount;
      this.shopId = res.data?.shopId;
      if (this.shopId) {
        this.getShopDetails(this.shopId);
      }
    });
  }


  loadProducts(categoryId: number, subCategoryId: number) {
    this.isDisplayProducts = true;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = false;
    this.isCartView = false;
    this.isMainView = true;
    this.isDisplayProductDetails = false;
    //this.products = this.totalProducts.filter(f => f.subCategoryId == subCategoryId);
    this.orderService.getProductList(categoryId, subCategoryId).subscribe((res) => {
      res.data?.forEach((e: any) => e.productImage = environment.backend.host + '/' + e.productImage);
      this.products = res.data.filter((s: any) => s.isOutOfStock != true);
      this.products?.forEach(e => {
        e.salePrice = e.productPrices[0].salePrice;
        e.qty = 0;
        e.hasPriceStructure = e.productPrices.length > 1;
        e.lowestPrice = Math.min(...e.productPrices.map((p: any) => p.salePrice));
      });
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
      item.netAmount = Number(item.qty) * item.salePrice;
      item.vatAmount = (item.netAmount * this.vatPercentage) / 100;
      this.cartItems.push(item);
    }
    this.updateCalculations();
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
    sessionStorage.setItem('createcartItems', JSON.stringify(this.cartItems));
  }

  loadCartFromSession(): void {
    const savedCart = sessionStorage.getItem('createcartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCalculations();
    }
  }

  updateSalePrices() {
    // 1. Calculate total qty per group
    const groupTotals: Record<number, number> = {};

    this.cartItems.forEach(item => {
      if (item.mixMatchGroupId) {
        const groupId = item.mixMatchGroupId ?? 0;
        groupTotals[groupId] = (groupTotals[groupId] || 0) + item.qty;
      }
    });

    this.cartItems.forEach(item => {
      if (item.mixMatchGroupId) {
        let totalGroupQty = this.cartItems
          .filter(x => x.mixMatchGroupId === item.mixMatchGroupId)
          .reduce((sum, x) => sum + x.qty, 0);

        let prodPrice = item.productPrices.filter((f: any) => totalGroupQty >= f.fromQty && totalGroupQty <= f.toQty);
        if (prodPrice != null && prodPrice.length > 0) {
          item.salePrice = prodPrice[0].salePrice;
        }
        else {
          item.salePrice = item.productPrices[item.productPrices.length - 1].salePrice;
        }
        item.netAmount = Number(item.qty) * item.salePrice;
        item.vatAmount = (item.netAmount * this.vatPercentage) / 100;
      }
    });
  }

  updateCalculations() {
    this.updateSalePrices();
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
    this.isDisplayProductDetails = false;
    this.isDisplayCatgories = true;
    this.isDisplaySubCatgories = false;
    this.isDisplayProducts = false;
    window.scrollTo(0, 0);
  }

  createOrder(): void {
    if (this.validateOrderAmount()) {
      const requestBody = {
        orderId: null,
        shopId: this.shopId,
        shippingAddress: this.shippingAddress,
        paymentMethodId: this.selectedPaymentMethodId,
        items: this.cartItems,
        itemTotal: this.netTotal,
        vatAmount: this.totalVatAmount,
        deliveryCharges: this.deliveryCharges,
        discountAmount: this.discountAmount,
        totalWithVATAmount: this.grandTotalWithVAT,
        totalWithOutVATAmount: this.grandTotalWithOutVAT,
        vatPercentage: this.vatPercentage,
        discountPercentage: this.discountPercentage,
        walletAmount: this.walletAmount,
        referenceNumber: this.shopCommissionId,
        requestType: this.requestType,
        isVat: this.requestType == 'B' ? 1 : 0
      };
      if (this.selectedPaymentMethodId) {
        this.orderService.create(requestBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created Successfully.");
            this.cartItems = [];
            setTimeout(() => this.closeWindow(), 2000);
            //window.close();
          }
          else {
            this.toasterService.showMessage(res.message);
          }
        });
      }
      else {
        this.toasterService.showMessage("Please select Payment Method, before to place an order.");
      }
    }
  }

  validateOrderAmount(): boolean {
    let isValid = true;
    if (this.isAdmin) {
      return isValid;
    }
    if (this.requestType == 'B') {
      this.getBonusAmount();
      if (this.grandTotalWithVAT > this.commissionAmount) {
        this.toasterService.showMessage("You cannot place order, cart amount exceeds the commission amount.");
        isValid = false;
      }
      else if (this.grandTotalWithVAT < this.minimumCartAmount) {
        this.toasterService.showMessage('You cannot place order, minimum cart value should be £ ' + this.minimumCartAmount + ' pounds.');
        isValid = false;
      }
    }
    else if (this.requestType == 'MC') {
      this.getCommissionHistoryDetails();
      if (!this.isRedemed) {
        if (this.subTotal > this.commissionAmount) {
          this.toasterService.showMessage("You cannot place order, cart amount exceeds the commission amount.");
          isValid = false;
        }
      }
      else {
        this.toasterService.showMessage("You cannot place order, Monthly Commission has already been used.");
        isValid = false;
      }
    }
    else {
      if (this.netTotal < this.minimumCartAmount) {
        this.toasterService.showMessage("You cannot place order, minimum cart value should be £ 50.00 pounds.");
        isValid = false;
      }
    }

    return isValid;
  }

  loadAvailableCheques() {
    this.lookupService.getAvailableShopCommissionCheques(this.shopId).subscribe((res) => {
      this.availableCommissionChequeNumbers = res.data;
    });
  }

  editAddress(): void {
    this.isEditAddress = true;
  }

  cancelAddress(): void {
    this.isEditAddress = false;
    this.shippingAddress = this.shopDetails.addressLine1;
  }

  updateAddress(): void {
    const requestBody = {
      shopId: this.shopId,
      address: this.shippingAddress,
      shopEmail: this.shopEmail,
      shopPhone: this.shopPhone
    };

    this.shopService.updateAddress(requestBody).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Address details updated successfully.");
        this.isAddressUpdated = true;
        this.isEditAddress = false;
      }
      else {
        this.toasterService.showMessage(res.message);
      }
    });
  }

  closeWindow() {
    window.close();  // Attempt to close the window/tab
  }


  onChequeNumberChange(event: any): void {
    let item = this.availableCommissionChequeNumbers.find(f => f.id == event.value);
    if (item != null) {
      var walletAmount = Number(item.name);

      if (walletAmount > this.subTotal) {
        this.walletAmount = 0;
        this.shopCommissionId = null;
        this.toasterService.showMessage('You can not use this wallet commission as it exceeds the sub total.');
      }
      else {
        this.walletAmount = walletAmount;
        this.shopCommissionId = item.id;
      }
    }
    else {
      this.walletAmount = 0;
      this.shopCommissionId = null;
    }
  }

  increaseQuantity(item: any) {
    if (item.qty == undefined || item.qty == 0) {
      item.qty = 1;
      this.addToCart(item);
    }
    else if (item.qty > 0) {
      item.qty++;
      this.updateCartItemQuantity(item, item.qty)
    }
  }

  decreaseQuantity(item: any) {
    if (item.qty > 0) {
      item.qty--;
    }
    if (item.qty == 0) {
      this.removeCartItem(item);
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
      this.products = res.data.filter((s: any) => s.isOutOfStock != true);
      this.products?.forEach(e => {
        e.salePrice = e.productPrices[0].salePrice;
        e.qty = 0;
      });
    });
    this.closeSidebar();
  }

  onBackFromDetails() {
    this.isDisplayProductDetails = false;
    this.isDisplayProducts = true;
    this.isMainView = true;
    this.isCartView = false;
  }

  onSearchChange() {

    this.isDisplayProducts = true;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = false;
    this.isCartView = false;
    this.isMainView = true;
    this.isDisplayProductDetails = false;
    
    this.orderService.getProductSearchList(this.seachProduct).subscribe((res) => {
      res.data?.forEach((e: any) => e.productImage = environment.backend.host + '/' + e.productImage);
      this.products = res.data.filter((s: any) => s.isOutOfStock != true);
      this.products?.forEach(e => {
        e.salePrice = e.productPrices[0].salePrice;
        e.qty = 0;
        e.hasPriceStructure = e.productPrices.length > 1;
        e.lowestPrice = Math.min(...e.productPrices.map((p: any) => p.salePrice));
      });
    });

    this.closeSidebar();

  }

  clearSearch() {
    this.seachProduct = '';
  }

  // applyPricing(cart: any[] ): any[] {
  //   // 1. Calculate total quantities per group
  //   const groupTotals: Record<number, number> = {};

  //   cart.forEach(item => {

  //     const groupId = product.mixMatchGroupId ?? product.productId; // standalone if no group
  //     groupTotals[groupId] = (groupTotals[groupId] || 0) + item.qty;
  //   });

  //   // 2. Update cart items with correct pricing
  //   return cart.map(item => {
  //     const product = products.find(p => p.productId === item.productId);
  //     if (!product) return item;

  //     const groupId = product.mixMatchGroupId ?? product.productId;
  //     const totalGroupQty = groupTotals[groupId];

  //     // Find price tier
  //     const priceTier = product.productPrices.find(
  //       pp => totalGroupQty >= pp.fromQty && totalGroupQty <= pp.toQty
  //     );

  //     const unitPrice = priceTier ? priceTier.salePrice : 0;

  //     return {
  //       ...item,
  //       unitPrice,
  //       lineTotal: +(unitPrice * item.qty).toFixed(2)
  //     };
  //   });
  // }

}
