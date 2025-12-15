import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebstorgeService } from '../../services/web-storage.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, filter, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})


export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  loggedInUser: any;
  userRole = '';
  searchControl = new FormControl('');
  shopLookup = [];
  filteredItems!: any[];

  constructor(
    public dialog: MatDialog,
    public webstorgeService: WebstorgeService,
    public router: Router,
    public shopService: ShopService,
    public authService: AuthService
  ) {
    this.loggedInUser = this.webstorgeService.getUserInfo();
    this.userRole = this.webstorgeService.getUserRole();
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // wait for user to stop typing
      distinctUntilChanged(),
      filter((value: any) => value && value.trim().length > 3),
      switchMap(value => this.shopService.globalShopSearch(value))
    )
      .subscribe((response: any) => {
        this.filteredItems = response.data;
      });
  }

  logout(): void {
    console.log('Logging out');
    this.webstorgeService.clearAll();
    if (this.userRole === 'Retailer') {
      this.router.navigate(['/retailer/login']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  onOptionSelected(option: any) {
    if (option) {
      //this.searchControl.setValue(option.shopName);
      // Navigate to detail page (example: /product/1)
      this.router.navigate(['/onfield', option.areaId, option.shopId]);
      this.searchControl.setValue('');
      //this.filteredItems = [];
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.filteredItems = [];   // optional: hide dropdown
  }

}