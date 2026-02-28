import { Component, HostListener, ViewChild } from '@angular/core';
import { WebstorgeService } from '../../services/web-storage.service';
import { ToasterService } from '../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-shopportal',
  templateUrl: './shopportal.component.html',
  styleUrl: './shopportal.component.scss'
})

export class ShopportalComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  selectedTabIndex = 0;
  shopId: number = 0;
  isMobile: boolean = false;
  shopAddressDetails: any

  constructor(
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private webstorgeService: WebstorgeService,
    private shopService: ShopService
  ) {
  }

  ngOnInit(): void {
    this.shopId = Number(this.route.snapshot.paramMap.get('id'));
    this.getShopAddressDetails();

  }

  getShopAddressDetails(): void {
    this.shopService.getShopAddressDetails(this.shopId).subscribe((res) => {
      this.shopAddressDetails = res.data;
    });
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1200;
    this.closeSidebar();
  }


  onTabChange(index: number) {
    this.selectedTabIndex = index;
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


}
