import { NavItem } from "../nav-item/nav-item";


export const AdminItems: NavItem[] = [

  // {
  //   displayName: 'Dashboards',
  //   iconName: 'home',
  //   route: '',
  //   children: [
  //     {
  //       displayName: 'Main',
  //       iconName: 'arrow_right',
  //       route: 'dashboard/main',
  //     },
  //     {
  //       displayName: 'Analytics',
  //       iconName: 'arrow_right',
  //       route: 'dashboard/analytics',
  //     },
  //   ],
  // },
  {
    displayName: 'Dashboard',
    iconName: 'roofing',
    route: 'dashboard/main',
  },
  {
    displayName: 'Allocate',
    iconName: 'account_tree',
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
    displayName: 'Reports',
    iconName: 'finance_mode',
    route: '',
    children: [
      {
        displayName: 'Monthly Activations',
        iconName: 'arrow_right',
        route: 'report/monthly/activations',
      },
      {
        displayName: 'Analysis Report',
        iconName: 'arrow_right',
        route: 'report/historical/activations',
      },
      {
        displayName: 'Network Report',
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
        displayName: 'Area Commissions',
        iconName: 'arrow_right',
        route: 'report/area-commissions',
      },
      {
        displayName: 'Monthly Accessories Report',
        iconName: 'arrow_right',
        route: 'report/monthly-accessories-report',
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
    iconName: 'settings',
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
    iconName: 'manage_accounts',
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
    displayName: 'Accessories',
    iconName: 'devices_other',
    route: '',
    children: [
      {
        displayName: 'Sales',
        iconName: 'arrow_right',
        route: 'accessories/sales',
      }, 
    ],
  },
  {
    displayName: 'IMEI',
    iconName: 'barcode_scanner',
    route: 'imei/search',
  },
  {
    displayName: 'OnField',
    iconName: 'home_work',
    route: 'onfield',
  },
  {
    displayName: 'Chat',
    iconName: 'sms',
    route: 'chat',
  },
  // {
  //   displayName: 'Edit Profile',
  //   iconName: 'account_circle',
  //   route: 'profile/edit',
  // },


];


