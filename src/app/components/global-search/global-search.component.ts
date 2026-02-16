import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  displayedColumns: string[] = ['id', 'shopName', 'postCode', 'address','areaName'];

  constructor(private route: ActivatedRoute, private router: Router, private shopService: ShopService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch();
      }
    });
  }

  performSearch() {
    this.shopService.globalShopSearch(this.searchQuery).subscribe((response: any) => {
      this.searchResults = response.data || [];
    });
  }

  onRowClick(item: any) {
    this.router.navigate(['/onfield', item.areaId, item.shopId]);
  }

}
