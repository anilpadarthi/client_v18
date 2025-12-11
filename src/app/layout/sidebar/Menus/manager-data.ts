import { NavItem } from "../nav-item/nav-item";

export const ManagerItems: NavItem[] = [

  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: 'dashboard/main',
  },

  {
    displayName: 'Sim Info',
    iconName: 'search',
    route: 'imei/search',
  },
  {
    displayName: 'On-Field',
    iconName: 'store',
    route: 'onfield',
  },
  {
    displayName: 'Allocate',
    iconName: 'inventory',
    route: '',
    children: [
      {
        displayName: 'Allocate Areas',
        iconName: 'arrow_right',
        route: 'allocatearea',
      },
    ],
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
        displayName: 'Daily Reports',
        iconName: 'arrow_right',
        route: 'report/daily-report',
      },
      {
        displayName: 'Area Commissions',
        iconName: 'arrow_right',
        route: 'report/area-commissions',
      },

      {
        displayName: 'Sim Allocations',
        iconName: 'arrow_right',
        route: 'report/simallocation-report',
      },
      {
        displayName: 'KPI Targets',
        iconName: 'arrow_right',
        route: 'report/kpi-target',
      },
      {
        displayName: 'Track Reports',
        iconName: 'arrow_right',
        route: 'report/track',
      },
      {
        displayName: 'Payslip',
        iconName: 'arrow_right',
        route: 'management/payslip',
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

  {
    displayName: 'Cheque Info',
    iconName: 'checkbook',
    route: 'commission-cheque-status',
  },

  {
    displayName: 'Change Password',
    iconName: 'lock_reset',
    route: 'change-password',
  },
  // {
  //   displayName: 'Chat',
  //   iconName: 'chat',
  //   route: 'chat',
  // },

  // {
  //   displayName: 'Edit Profile',
  //   iconName: 'account_circle',
  //   route: 'profile/edit',
  // },


];