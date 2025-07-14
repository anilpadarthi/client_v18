import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebstorgeService } from '../../services/web-storage.service';

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

  constructor(
    public dialog: MatDialog,
    public webstorgeService: WebstorgeService
  ) {
    this.loggedInUser = this.webstorgeService.getUserInfo();
    this.userRole = this.webstorgeService.getUserRole();

  }

  logout(): void {
    this.webstorgeService.logout();
  }
}