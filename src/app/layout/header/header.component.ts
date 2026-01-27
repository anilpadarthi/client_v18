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
  showSearchInput = false;

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
  }

  logout(): void {
    this.webstorgeService.clearAll();
    if (this.userRole === 'Retailer') {
      this.router.navigate(['/retailer/login']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  onSearchEnter(event: any) {
    const searchValue = this.searchControl.value?.trim();
    if (searchValue) {
      this.router.navigate(['/global-search'], { queryParams: { q: searchValue } });
      
      if (!this.showToggle) {
        this.showSearchInput = false;
      }
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
    if (!this.showToggle) {
      this.showSearchInput = false;
    }
  }

}