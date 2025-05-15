import { NavItem } from "../nav-item/nav-item";





export const agentItems: NavItem[] = [





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
    displayName: 'Reports',
    iconName: 'monitoring',
    route: '',
    children: [
      {
        displayName: 'Monthly Activations',
        iconName: 'monitoring',
        route: 'report/monthly/activations',
      },
      {
        displayName: 'Area Commissions',
        iconName: 'arrow_right',
        route: 'report/area-commissions',
      },
      {
        displayName: 'Payslip',
        iconName: 'text_snippet',
        route: 'management/payslip',
      },
      {
        displayName: 'Monthly Accessories Report',
        iconName: 'arrow_right',
        route: 'report/monthly-accessories-report',
      },
      {
        displayName: 'Sim Allocations',
        iconName: 'arrow_right',
        route: 'report/simallocation-report',
      },
    ]
  },

  {
    displayName: 'Accessories',
    iconName: 'point_of_sale',
    route: '',
    children: [
      {
        displayName: 'Sales',
        iconName: 'arrow_right',
        route: 'accessories/sales',
      },
      {
        displayName: 'Request Sims',
        iconName: 'arrow_right',
        route: 'accessories/agent-sim-request',
        target: '_blank'
      },
    ],
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