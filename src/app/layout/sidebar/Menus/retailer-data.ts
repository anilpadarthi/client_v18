import { NavItem } from "../nav-item/nav-item";

export const RetailerItems: NavItem[] = [

  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: 'dashboard/main',
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
        displayName: 'Sim Allocations',
        iconName: 'file-description',
        route: 'report/simallocation-report',
      },
      {
        displayName: 'KPI Targets',
        iconName: 'file-description',
        route: 'report/kpi-target',
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
    displayName: 'Management',
    iconName: 'widgets',
    route: '',
    children: [
      {
        displayName: 'Payslip',
        iconName: 'file-description',
        route: 'management/payslip',
      },

      {
        displayName: 'Agreement Requests',
        iconName: 'arrow_right',
        route: 'management/agreement-requests',
      },
      {
        displayName: 'Commission Tier Requests',
        iconName: 'arrow_right',
        route: 'management/commission-tier-requests',
      },
      {
        displayName: 'Attendance',
        iconName: 'arrow_right',
        route: 'management/attendance-report',
      },

      {
        displayName: 'Shop Commission Cheques',
        iconName: 'arrow_right',
        route: 'shop-commission-cheques',
      },
      {
        displayName: 'Bank Cheques',
        iconName: 'arrow_right',
        route: 'bank-cheques',
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
        displayName: 'Create Order',
        iconName: 'arrow_right',
        route: 'accessories/create-order',
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