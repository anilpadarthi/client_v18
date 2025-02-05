import { NavItem } from "../nav-item/nav-item";





export const agentItems: NavItem[] = [


 

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
        displayName: 'Request Sims',
        iconName: 'arrow_right',
        route: 'aceessories/agent-sim-request',
        target: '_blank'
      },
    ],
  },
  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: 'dashboard/main',
  },
  {
    displayName: 'OnField',
    iconName: 'store',
    route: 'onfield',
  },
  {
    displayName: 'Monthly Activations',
    iconName: 'monitoring',
    route: 'report/monthly/activations',
  },
  {
    displayName: 'Shop',
    iconName: 'manage_accounts',
    route: 'shops',
  },
  {
    displayName: 'IMEI Search',
    iconName: 'manage_search',
    route: 'imei/search',
  },


  {
    displayName: 'Payslip',
    iconName: 'text_snippet',
    route: 'management/payslip',
  },
  {
    displayName: 'Chat',
    iconName: 'chat',
    route: 'chat',
  },


  // {
  //   displayName: 'Edit Profile',
  //   iconName: 'account_circle',
  //   route: 'profile/edit',
  // },


];