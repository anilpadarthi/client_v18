import { Component, OnInit, EventEmitter, Input, Output, } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../services/nav.service';
import { WebstorgeService } from '../../services/web-storage.service';
import { AdminItems } from '../sidebar/Menus/admin-data';
import { ManagerItems } from '../sidebar/Menus/manager-data';
import { AgentItems } from '../sidebar/Menus/agent-data';
import { HRItems } from '../sidebar/Menus/hr-data';
import { CallCenterItems } from '../sidebar/Menus/callcenter-data';
import { WarehouseItems } from '../sidebar/Menus/warehouse-data';
import { RetailerItems } from './Menus/retailer-data';

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
      case 1: this.navItems = AdminItems; break;
      case 2: this.navItems = AdminItems; break;
      case 3: this.navItems = ManagerItems; break;
      case 4: this.navItems = AgentItems; break;
      case 5: this.navItems = HRItems; break;
      case 6: this.navItems = WarehouseItems; break;
      case 7: this.navItems = RetailerItems; break;
      case 8: this.navItems = CallCenterItems; break;
      default: this.navItems = navItems; break;
    }

  }

  ngOnInit(): void { }
}