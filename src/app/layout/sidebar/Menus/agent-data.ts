import { NavItem } from "../nav-item/nav-item";





export const agentItems: NavItem[] = [

  {
    displayName: 'Dashboards',
    iconName: 'home',
    route: '',
    children: [
      {
        displayName: 'Main',
        iconName: 'arrow_right',
        route: 'dashboard/main',
      },
      {
        displayName: 'Analytics',
        iconName: 'arrow_right',
        route: 'dashboard/analytics',
      },
    ],
  },
  {
    displayName: 'IMEI',
    iconName: 'manage_search',
    route: 'imei/search',
  },
  {
    displayName: 'OnField',
    iconName: 'store',
    route: 'onfield',
  },
  {
    displayName: 'Reports',
    iconName: 'monitoring',
    route: '',
    children: [
      {
        displayName: 'Monthly Activations',
        iconName: 'arrow_right',
        route: 'report/monthly/activations',
      },
      {
        displayName: 'KPI Targets',
        iconName: 'arrow_right',
        route: 'report/kpi-target',
      },
      {
        displayName: 'Commission Statements',
        iconName: 'arrow_right',
        route: 'report/commission-statement',
      },
    ],
  },
  {
    displayName: 'Setup',
    iconName: 'manage_accounts',
    route: '',
    children: [
      {
        displayName: 'Area',
        iconName: 'arrow_right',
        route: 'areas',
      },
      {
        displayName: 'Shop',
        iconName: 'arrow_right',
        route: 'shops',
      },
    ],
  },

  {
    displayName: 'Payslip',
    iconName: 'text_snippet',
    route: 'payslip',
  },
  {
    displayName: 'Chat',
    iconName: 'chat',
    route: 'chat',
  },

  {
    displayName: 'Accessories',
    iconName: 'point_of_sale',
    route: '',
    children: [
      {
        displayName: 'Sales',
        iconName: 'arrow_right',
        route: 'aceessories/sales',
      },
      {
        displayName: 'Create Order',
        iconName: 'arrow_right',
        route: 'aceessories/create-order',
        target: '_blank'
      },
    ],
  },
  {
    displayName: 'Edit Profile',
    iconName: 'account_circle',
    route: 'profile/edit',
  },


];