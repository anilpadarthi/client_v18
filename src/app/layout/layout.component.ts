import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebstorgeService } from '../services/web-storage.service';
import { navItems } from './sidebar/sidebar-data';
import { adminItems,managerItems } from './sidebar/Menus/admin-data';
import { agentItems } from './sidebar/Menus/agent-data';
import { CoreService } from '../services/core.service';
import { NavService } from '../services/nav.service';
import { AppSettings } from '../config';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: [],
})

export class LayoutComponent implements OnInit {
  navItems = navItems;
  @ViewChild('leftsidenav')
  public sidenav: MatSidenav | any;
  isDisplaySideMenu = true;
  //get options from service
  options:any;
  resView = false;
  loggedInUser: any;
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  constructor(
    private settings: CoreService,
    private breakpointObserver: BreakpointObserver,
    public navService: NavService,
    public webstorgeService: WebstorgeService,
    private router: Router
  ) {
    this.options = this.settings.getOptions();
    this.htmlElement = document.querySelector('html')!;
    var userRole = this.webstorgeService.getUserInfo().userRoleId;
    switch (userRole) {
      case 2: this.navItems = adminItems; break;
      case 3: this.navItems = managerItems; break;
      case 4: this.navItems = agentItems; break;
      default: this.navItems = navItems; break;
    }

    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
        this.resView = state.breakpoints[BELOWMONITOR];
      });

  }

  ngOnInit(): void {
    this.loggedInUser = this.webstorgeService.getUserInfo();
    this.router.events.subscribe((event) => {
      if(this.router.url.includes('create-order') || this.router.url.includes('edit-order')){
        this.isDisplaySideMenu = false;
      }
      
    });
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
  }

  get isTablet(): boolean {
    return this.resView;
  }

  logout(): void {
    this.webstorgeService.logout();
  }
}

// export class LayoutComponent implements OnInit {
//   navItems = navItems;
//   options!: AppSettings;
//   @ViewChild('leftsidenav')
//   sidenav!: MatSidenav;
//   resView = false;
//   @ViewChild('content', { static: true }) content!: MatSidenavContent;
//   //get options from service

//   private layoutChangesSubscription = Subscription.EMPTY;
//   private isMobileScreen = false;
//   private isContentWidthFixed = true;
//   private isCollapsedWidthFixed = false;
//   private htmlElement!: HTMLHtmlElement;

//   get isOver(): boolean {
//     return this.isMobileScreen;
//   }

//   get isTablet(): boolean {
//     return this.resView;
//   }
//   loggedInUser: any;
//   // for mobile app sidebar




//   constructor(
//     private settings: CoreService,
//     private mediaMatcher: MediaMatcher,
//     private router: Router,
//     private breakpointObserver: BreakpointObserver,
//     private navService: NavService,
//     public webstorgeService: WebstorgeService
//   ) {
//     this.options = this.settings.getOptions();
//     var userRole = this.webstorgeService.getUserInfo().userRoleId;
//     switch (userRole) {
//       case 2: this.navItems = adminItems; break;
//       case 4: this.navItems = agentItems; break;
//       default: this.navItems = navItems; break;
//     }

//     this.htmlElement = document.querySelector('html')!;
//     this.layoutChangesSubscription = this.breakpointObserver
//       .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
//       .subscribe((state) => {
//         // SidenavOpened must be reset true when layout changes
//         this.options.sidenavOpened = true;
//         this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
//         if (this.options.sidenavCollapsed == false) {
//           this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
//         }
//         this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
//         this.resView = state.breakpoints[BELOWMONITOR];
//       });

//     // Initialize project theme with options
//     this.receiveOptions(this.options);

//     // This is for scroll to top
//     this.router.events
//       .pipe(filter((event) => event instanceof NavigationEnd))
//       .subscribe((e) => {
//         this.content.scrollTo({ top: 0 });
//       });
//   }

//   ngOnInit(): void {
   
//     this.loggedInUser = this.webstorgeService.getUserInfo();
//   }

//   ngOnDestroy() {
//     this.layoutChangesSubscription.unsubscribe();
//   }

//   toggleCollapsed() {
//     this.isContentWidthFixed = false;
//     this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
//     this.resetCollapsedState();
//   }

//   resetCollapsedState(timer = 400) {
//     setTimeout(() => this.settings.setOptions(this.options), timer);
//   }

//   onSidenavClosedStart() {
//     this.isContentWidthFixed = false;
//   }

//   onSidenavOpenedChange(isOpened: boolean) {
//     this.isCollapsedWidthFixed = !this.isOver;
//     this.options.sidenavOpened = isOpened;
//     this.settings.setOptions(this.options);
//   }

//   receiveOptions(options: AppSettings): void {
//     this.options = options;
//     this.toggleDarkTheme(options);
//   }

//   toggleDarkTheme(options: AppSettings) {
//     if (options.theme === 'dark') {
//       this.htmlElement.classList.add('dark-theme');
//       this.htmlElement.classList.remove('light-theme');
//     } else {
//       this.htmlElement.classList.remove('dark-theme');
//       this.htmlElement.classList.add('light-theme');
//     }
//   }

//   logout(): void {
//     this.webstorgeService.logout();
//   }


// }


// export class LayoutComponent implements OnInit {

//   @ViewChild('leftsidenav')
//   public sidenav: MatSidenav | any;
//   navItems = navItems;
//   loggedInUser: any;
//   options!: AppSettings;
//   resView = false;
//   //get options from service
//   private layoutChangesSubscription = Subscription.EMPTY;
//   private isMobileScreen = false;
//   private isContentWidthFixed = true;
//   private isCollapsedWidthFixed = false;
//   private htmlElement!: HTMLHtmlElement;

//   get isOver(): boolean {
//     return this.isMobileScreen;
//   }

//   constructor(
//     private breakpointObserver: BreakpointObserver,
//     private settings: CoreService,
//     public webstorgeService: WebstorgeService
//   ) {
//     this.htmlElement = document.querySelector('html')!;
//     this.layoutChangesSubscription = this.breakpointObserver
//       .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
//       .subscribe((state) => {
//         // SidenavOpened must be reset true when layout changes

//         this.isMobileScreen = state.breakpoints[MOBILE_VIEW];

//         this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
//       });
//     this.options = this.settings.getOptions();
//     var userRole = this.webstorgeService.getUserInfo().userRoleId;
//     console.log(userRole);
//     switch (userRole) {
//       case 2: this.navItems = adminItems; console.log(this.navItems); break;
//       case 4: this.navItems = agentItems; break;
//       default: this.navItems = navItems; break;
//     }
//   }

//   ngOnInit(): void {

//     this.loggedInUser = this.webstorgeService.getUserInfo();
//   }

//   ngOnDestroy() {
//     this.layoutChangesSubscription.unsubscribe();
//   }

//   toggleCollapsed() {
//     this.isContentWidthFixed = false;
//   }

//   onSidenavClosedStart() {
//     this.isContentWidthFixed = false;
//   }

//   onSidenavOpenedChange(isOpened: boolean) {
//     this.isCollapsedWidthFixed = !this.isOver;
//   }

//   logout(): void {
//     this.webstorgeService.logout();
//   }
// }