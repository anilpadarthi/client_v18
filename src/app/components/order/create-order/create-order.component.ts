import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { LookupService } from '../../../services/lookup.service';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import { ToasterService } from '../../../services/toaster.service';
import { ShopService } from '../../../services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})

export class CreateOrderComponent implements OnInit {

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  commissionAmount = 0.00;
  minimumCartAmount = 25.00;
  vatAmount = 0.00;
  subTotal = 0.00;
  deliveryCharges = 2.99;
  discountAmount = 0.00;
  grandTotal = 0.00;
  discountPercentage = 0.00;
  vatPercentage = 20.00;
  grandTotalWithVAT = 0.00;
  grandTotalWithOutVAT = 0.00;
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
  selectedPaymentMethodId = null;
  shopId: any = null;
  shopCommissionId: any = null;
  shippingAddress: any = null;
  walletAmount = null;
  isWalletAmountUsed = false;
  shopDetails: any = null;
  requestType: string | null = null;

  constructor(
    private orderService: OrderService,
    private lookupService: LookupService,
    private shopService: ShopService,
    private commissionStatementService: CommissionStatementService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
  ) {
  }


  displayedColumns: string[] = [
    'productImage',
    'productName',
    'productCode',
    'salePrice',
    'quantity',
    'amount',
    'action'
  ];


  ngOnInit(): void {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.requestType = this.route.snapshot.paramMap.get('type');
    if (this.requestType == 'COD') {
      this.shopId = id;
    }
    else if (this.requestType == 'AC') {
      this.shopCommissionId = id;
      this.commissionStatementService.getCommissionHistoryDetails(this.shopCommissionId).subscribe((res) => {
        this.commissionAmount = res.data?.commissionAmount;
        this.shopId = res.data?.shopId;
        this.minimumCartAmount = this.commissionAmount;
        this.deliveryCharges = 0.00;
        this.vatPercentage = 0.00;
      });
    }

    else if (this.requestType == 'B') {
      this.shopCommissionId = id;
      this.commissionStatementService.getCommissionHistoryDetails(this.shopCommissionId).subscribe((res) => {
        this.commissionAmount = res.data?.bonusAmount;
        this.shopId = res.data?.shopId;
        this.minimumCartAmount = this.commissionAmount;
        this.deliveryCharges = 0.00;
        this.vatPercentage = 0.00;
      });
    }

    else if (this.requestType == 'IB') {
      this.shopCommissionId = id;
      this.commissionStatementService.getCommissionHistoryDetails(this.shopCommissionId).subscribe((res) => {
        this.commissionAmount = res.data?.instantBonusAmount;
        this.shopId = res.data?.shopId;
        this.minimumCartAmount = this.commissionAmount;
        this.deliveryCharges = 0.00;
        this.vatPercentage = 0.00;
      });
    }


    this.orderService.getShoppingPageDetails().subscribe((res) => {
      res.data?.categories?.forEach((category: any) => {
        category.image = environment.backend.host + '/' + category.image;
        category.subCategories?.forEach((subCategory: any) => {
          subCategory.image = environment.backend.host + '/' + subCategory.image;
        });
      });

      res.data?.products?.forEach((e: any) => e.productImage = environment.backend.host + '/' + e.productImage);
      this.categories = res.data.categories;
      this.totalProducts = res.data.products;
    });

    this.lookupService.getOrderPaymentTypes().subscribe((res) => {
      this.paymentMethodLookup = res.data;
    });

    if (this.shopId) {
      this.shopService.getShop(this.shopId).subscribe((res) => {
        this.shopDetails = res.data.shop;
        this.shippingAddress = (this.shopDetails.addressLine1 + ', ' +
          res.data.shop.postCode + ', ' + 'London, UK');
      });
    }
  }


  loadProducts(subCategoryId: any) {
    this.isDisplayProducts = true;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = false;
    this.isCartView = false;
    this.products = this.totalProducts.filter(f => f.subCategoryId == subCategoryId);
    this.products.forEach(e => e.salePrice = e.productPrices[0].salePrice);
  }

  loadSubCategories(item: any) {
    this.isDisplayProducts = false;
    this.isDisplayCatgories = false;
    this.isDisplaySubCatgories = true;
    this.isCartView = false;
    this.subCategories = item.subCategories;
  }

  addToCart(item: any): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.productId === item.productId);

    if (!existingItem) {
      item.qty = '1';
      item.amount = Number(item.qty) * item.salePrice;
      this.cartItems.push(item);
    }
    this.saveCartToSession();
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
    existingItem.amount = Number(existingItem.qty) * existingItem.salePrice;
    this.saveCartToSession();
    this.updateCalculations();
  }

  removeCartItem(item: any): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.productId !== item.productId);
    this.saveCartToSession();
    this.updateCalculations();
  }

  viewCart(): void {
    this.isCartView = true;
    this.updateCalculations();
  }

  saveCartToSession(): void {
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  loadCartFromSession(): void {
    const savedCart = sessionStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  updateCalculations() {
    this.subTotal = 0;
    this.cartItems?.forEach((product) => {
      this.subTotal += product.qty * product.salePrice;
    });
    let netTotal = this.subTotal;
    this.vatAmount = (netTotal * this.vatPercentage) / 100;

    if (this.discountPercentage > 0) {
      this.discountAmount = (this.subTotal * this.discountPercentage) / 100;
    }
    this.grandTotalWithVAT = (netTotal + this.vatAmount + this.deliveryCharges) - this.discountAmount;
    this.grandTotalWithOutVAT = (netTotal + this.deliveryCharges) - this.discountAmount;
    this.grandTotal = (netTotal + this.vatAmount + this.deliveryCharges) - this.discountAmount;
  }

  continueShopping(): void {
    this.isCartView = false;
    this.isDisplayCatgories = true;
    this.isDisplaySubCatgories = false;
    this.isDisplayProducts = false;
  }

  createOrder(): void {
    if (this.subTotal <= this.minimumCartAmount) {
      this.toasterService.showMessage("You cannot place order, minimum cart value should be £ 25.00 pounds.")
    }
    else if (this.subTotal >= this.commissionAmount && this.requestType != 'COD') {
      this.toasterService.showMessage("You cannot place order, cart amount exceeds the commission amount.")
    }
    else {
      const requestBody = {
        orderId: null,
        shopId: this.shopId,
        shippingAddress: this.shippingAddress,
        paymentMethodId: this.selectedPaymentMethodId,
        items: this.cartItems,
        itemTotal: this.subTotal,
        vatAmount: this.vatAmount,
        deliveryCharges: this.deliveryCharges,
        discountAmount: this.discountAmount,
        totalWithVATAmount: this.grandTotalWithVAT,
        totalWithOutVATAmount: this.grandTotalWithOutVAT,
        vatPercentage: this.vatPercentage,
        discountPercentage: this.discountPercentage,
        walletAmount: this.isWalletAmountUsed ? this.walletAmount : null,
      };

      this.orderService.create(requestBody).subscribe((res) => {
        this.toasterService.showMessage("Created Successfully.");
        this.cartItems = [];
        setTimeout(() => this.closeWindow(), 2000);
        //window.close();
      });
    }
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
      shippingAddress: this.shippingAddress,
    };

    this.shopService.updateAddress(requestBody).subscribe((res) => {
      this.toasterService.showMessage("Address updated successfully.");
      this.isEditAddress = false;
    });
  }

  closeWindow() {
    window.close();  // Attempt to close the window/tab
  }

}
