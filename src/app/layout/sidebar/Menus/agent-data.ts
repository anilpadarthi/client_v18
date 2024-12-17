import { NavItem } from "../nav-item/nav-item";


export const agentItems: NavItem[] = [

  {
    displayName: 'Dashboards',
    iconName: 'home',
    route: '',
    children: [
      {
        displayName: 'Main',
        iconName: 'point',
        route: 'dashboard/main',
      },
      {
        displayName: 'Analytics',
        iconName: 'point',
        route: 'dashboard/analytics',
      },
    ],
  },
 
  {
    displayName: 'IMEI',
    iconName: 'file-description',
    route: '/IMEI',
  },
  {
    displayName: 'OnField',
    iconName: 'file-description',
    route: '/onfield',
  },
  {
    displayName: 'Reports',
    iconName: 'file-description',
    route: '',
    children: [
      {
        displayName: 'Monthly Activations',
        iconName: 'point',
        route: '/reports/monthlyactivations',
      },
      {
        displayName: 'Historical Activations',
        iconName: 'point',
        route: '/reports/historicalactivations',
      },
      {
        displayName: 'Network Reports',
        iconName: 'point',
        route: 'dashboard/analytics',
      },
      {
        displayName: 'Sim Allocations',
        iconName: 'file-description',
        route: '/reports/simallocations',
      },
      {
        displayName: 'KPI Targets',
        iconName: 'file-description',
        route: '/reports/simallocations',
      },
      
    ],
  },
  {
    displayName: 'Setup',
    iconName: 'file-description',
    route: '',
    children: [
      {
        displayName: 'Areas',
        iconName: 'point',
        route: '/areas',
      },
      {
        displayName: 'Shops',
        iconName: 'point',
        route: '/shops',
      },
    ],
  },
  {
    displayName: 'Chat',
    iconName: 'point',
    route: 'dashboard/main',
  },
  {
    displayName: 'Edit Profile',
    iconName: 'file-description',
    route: '/profile/edit',
  },
];
