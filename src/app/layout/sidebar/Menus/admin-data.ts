import { NavItem } from "../nav-item/nav-item";


export const adminItems: NavItem[] = [

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
    displayName: 'Allocate',
    iconName: 'inventory',
    route: '',
    children: [
      {
        displayName: 'Allocate Areas',
        iconName: 'arrow_right',
        route: 'allocatearea',
      },
      {
        displayName: 'Allocate Agents',
        iconName: 'arrow_right',
        route: 'allocateagent',
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
        displayName: 'Analysis Reports',
        iconName: 'arrow_right',
        route: 'report/historical/activations',
      },
      {
        displayName: 'Network Reports',
        iconName: 'arrow_right',
        route: 'report/network-report',
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
        displayName: 'Commission Statements',
        iconName: 'arrow_right',
        route: 'report/commission-statement',
      },
      {
        displayName: 'Daily Reports',
        iconName: 'arrow_right',
        route: 'report/daily-report',
      },
      {
        displayName: 'Track',
        iconName: 'arrow_right',
        route: 'report/track',
      },
    ],
  },
  {
    displayName: 'Setup',
    iconName: 'manage_accounts',
    route: '',
    children: [
      {
        displayName: 'User',
        iconName: 'arrow_right',
        route: 'users',
      },
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
      {
        displayName: 'Network',
        iconName: 'arrow_right',
        route: 'networks',
      },
      {
        displayName: 'Supplier',
        iconName: 'arrow_right',
        route: 'suppliers',
      },
      {
        displayName: 'Category',
        iconName: 'arrow_right',
        route: 'categories',
      },
      {
        displayName: 'Sub-Category',
        iconName: 'arrow_right',
        route: 'sub-categories',
      },
      {
        displayName: 'Product',
        iconName: 'arrow_right',
        route: 'products',
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
        iconName: 'arrow_right',
        route: 'management/payslip',
      },
      {
        displayName: 'Uploads',
        iconName: 'arrow_right',
        route: 'management/bulk-upload',
      },
      {
        displayName: 'WhatsApp Reports',
        iconName: 'arrow_right',
        route: 'management/whatsapp',
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
        displayName: 'Expenses',
        iconName: 'arrow_right',
        route: 'management/expenses',
      },
      {
        displayName: 'Shop Commission Cheques',
        iconName: 'arrow_right',
        route: 'management/shop-commission-cheques',
      },
      {
        displayName: 'Bank Cheques',
        iconName: 'arrow_right',
        route: 'management/bank-cheques',
      },
    ],
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
      {
        displayName: 'Request Sims',
        iconName: 'arrow_right',
        route: 'aceessories/agent-sim-request/8',
        target: '_blank'
      },
    ],
  },

  // {
  //   displayName: 'Edit Profile',
  //   iconName: 'account_circle',
  //   route: 'profile/edit',
  // },


];


export const managerItems: NavItem[] = [

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
        displayName: 'Analysis Reports',
        iconName: 'arrow_right',
        route: 'report/historical/activations',
      },
      {
        displayName: 'Network Reports',
        iconName: 'arrow_right',
        route: 'report/network-report',
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
      {
        displayName: 'Commission Statements',
        iconName: 'arrow_right',
        route: 'report/commission-statement',
      },
      {
        displayName: 'Daily Reports',
        iconName: 'arrow_right',
        route: 'report/daily-report',
      },
      {
        displayName: 'Track',
        iconName: 'arrow_right',
        route: 'report/track',
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

  // {
  //   displayName: 'Edit Profile',
  //   iconName: 'account_circle',
  //   route: 'profile/edit',
  // },


];