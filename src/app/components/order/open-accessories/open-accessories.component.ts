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
  selector: 'app-open-accessories',
  templateUrl: './open-accessories.component.html',
  styleUrl: './open-accessories.component.scss'
})

export class OpenAccessoriesComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile: boolean = false;

  showFiller = false;
  isLoading = false;

  isMainView = true;
  isCartView = false;
  isDisplayCatgories = true;
  isDisplaySubCatgories = false;
  isDisplayProducts = false;
  isDisplayProductDetails = false;
  categories: any[] = [];
  subCategories: any[] = [];
  products: any[] = [];
  selectedProduct: any = null;

  constructor(
    private orderService: OrderService,
  ) {
    this.checkScreenSize();
  }

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
    this.orderService.getShoppingPageDetails().subscribe((res) => {
      let categories = res.data?.categories;
      categories?.forEach((category: any) => {
        category.image = environment.backend.host + '/' + category.image;
        category.subCategories?.forEach((subCategory: any) => {
          subCategory.image = environment.backend.host + '/' + subCategory.image;
        });
      });
      this.categories = categories;
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


  viewProductDetails(item: any): void {
    this.isDisplayProductDetails = true;
    this.isCartView = false;
    this.isMainView = false;
    this.selectedProduct = item;
  }

}
