import { Component, OnInit, EventEmitter, Input, Output, } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../services/nav.service';
import { WebstorgeService } from '../../services/web-storage.service';
import { adminItems, managerItems } from '../sidebar/Menus/admin-data';
import { agentItems } from '../sidebar/Menus/agent-data';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
  navItems = navItems;
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  constructor(
    public navService: NavService,
    public webstorgeService: WebstorgeService,

  ) {

    var userRole = this.webstorgeService.getUserInfo().userRoleId;
    switch (userRole) {
      case 1: this.navItems = adminItems; break;
      case 2: this.navItems = adminItems; break;
      case 3: this.navItems = managerItems; break;
      case 4: this.navItems = agentItems; break;
      default: this.navItems = navItems; break;
    }

  }

  ngOnInit(): void { }
}