import { NavItem } from "../nav-item/nav-item";


export const AdminItems: NavItem[] = [

  // {
  //   displayName: 'Dashboards',
  //   iconName: 'home',
  //   route: '',
  //   children: [
  //     {
  //       displayName: 'Main',
  //       iconName: 'fiber_manual_record',
  //       route: 'dashboard/main',
  //     },
  //     {
  //       displayName: 'Analytics',
  //       iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
        route: 'allocatearea',
      },
      {
        displayName: 'Allocate Agents',
        iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
        route: 'report/monthly/activations',
      },
      {
        displayName: 'Analysis Report',
        iconName: 'fiber_manual_record',
        route: 'report/historical/activations',
      },
      {
        displayName: 'Network Report',
        iconName: 'fiber_manual_record',
        route: 'report/network-report',
      },
      {
        displayName: 'Sim Allocations',
        iconName: 'fiber_manual_record',
        route: 'report/simallocation-report',
      },
      {
        displayName: 'KPI Targets',
        iconName: 'fiber_manual_record',
        route: 'report/kpi-target',
      },
      {
        displayName: 'Commission Statements',
        iconName: 'fiber_manual_record',
        route: 'report/commission-statement',
      },
      {
        displayName: 'Area Commissions',
        iconName: 'fiber_manual_record',
        route: 'report/area-commissions',
      },
      {
        displayName: 'Monthly Accessories Report',
        iconName: 'fiber_manual_record',
        route: 'report/monthly-accessories-report',
      },
      {
        displayName: 'Daily Reports',
        iconName: 'fiber_manual_record',
        route: 'report/daily-report',
      },
      {
        displayName: 'Track',
        iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
        route: 'users',
      },
      {
        displayName: 'Area',
        iconName: 'fiber_manual_record',
        route: 'areas',
      },
      {
        displayName: 'Shop',
        iconName: 'fiber_manual_record',
        route: 'shops',
      },
      {
        displayName: 'Network',
        iconName: 'fiber_manual_record',
        route: 'networks',
      },
      {
        displayName: 'Supplier',
        iconName: 'fiber_manual_record',
        route: 'suppliers',
      },
      {
        displayName: 'Category',
        iconName: 'fiber_manual_record',
        route: 'categories',
      },
      {
        displayName: 'Sub-Category',
        iconName: 'fiber_manual_record',
        route: 'sub-categories',
      },
      {
        displayName: 'Product',
        iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
        route: 'management/payslip',
      },
      {
        displayName: 'Uploads',
        iconName: 'fiber_manual_record',
        route: 'management/bulk-upload',
      },
      {
        displayName: 'WhatsApp Reports',
        iconName: 'fiber_manual_record',
        route: 'management/whatsapp',
      },
      {
        displayName: 'Agreement Requests',
        iconName: 'fiber_manual_record',
        route: 'management/agreement-requests',
      },
      {
        displayName: 'Commission Tier Requests',
        iconName: 'fiber_manual_record',
        route: 'management/commission-tier-requests',
      },
      {
        displayName: 'Attendance',
        iconName: 'fiber_manual_record',
        route: 'management/attendance-report',
      },
      {
        displayName: 'Expenses',
        iconName: 'fiber_manual_record',
        route: 'management/expenses',
      },
      {
        displayName: 'Shop Commission Cheques',
        iconName: 'fiber_manual_record',
        route: 'management/shop-commission-cheques',
      },
      {
        displayName: 'Bank Cheques',
        iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
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


