import { NavItem } from "../nav-item/nav-item";





export const AgentItems: NavItem[] = [

  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: 'dashboard/main',
  },
  {
    displayName: 'On-Field',
    iconName: 'store',
    route: 'onfield',
  },
   {
    displayName: 'Manage Areas',
    iconName: 'manage_accounts',
    route: 'areas',
  },
  {
    displayName: 'Manage Shops',
    iconName: 'manage_accounts',
    route: 'shops',
  },
  {
    displayName: 'Sim Info',
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
        iconName: 'arrow_right',
        route: 'report/monthly/activations',
      },
      {
        displayName: 'Analysis Reports',
        iconName: 'arrow_right',
        route: 'report/historical/activations',
      },
      {
        displayName: 'Area Commissions',
        iconName: 'arrow_right',
        route: 'report/area-commissions',
      },
      {
        displayName: 'Payslip',
        iconName: 'arrow_right',
        route: 'management/payslip',
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
        route: 'accessories/sim-request',
        target: '_blank'
      },
    ],
  },
  // {
  //   displayName: 'Chat',
  //   iconName: 'chat',
  //   route: 'chat',
  // },

  {
    displayName: 'Cheque Info',
    iconName: 'checkbook',
    route: 'commission-cheque-status',
  },

  {
    displayName: 'Your Digital ID',
    iconName: 'chat',
    route: 'digitalId',
  },

  {
    displayName: 'Change Password',
    iconName: 'lock_reset',
    route: 'change-password',
  },


  // {
  //   displayName: 'Edit Profile',
  //   iconName: 'account_circle',
  //   route: 'profile/edit',
  // },


];