import { NavItem } from "../nav-item/nav-item";


export const adminItems: NavItem[] = [

  {
    displayName: 'Dashboards',
    iconName: 'home',
    route: '',
    children: [
      {
        displayName: 'Main',
        iconName: 'fiber_manual_record',
        route: 'dashboard/main',
      },
      {
        displayName: 'Analytics',
        iconName: 'fiber_manual_record',
        route: 'dashboard/analytics',
      },
    ],
  },
  {
    displayName: 'Allocate',
    iconName: 'home',
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
    displayName: 'IMEI',
    iconName: 'file-description',
    route: 'imei/search',
  },
  {
    displayName: 'EDIT PROFILE',
    iconName: 'file-description',
    route: 'profile/edit',
  },
  {
    displayName: 'OnField',
    iconName: 'file-description',
    route: 'onfield',
  },
  {
    displayName: 'Reports',
    iconName: 'file-description',
    route: '',
    children: [
      {
        displayName: 'Monthly Activations',
        iconName: 'fiber_manual_record',
        route: 'report/monthly/activations',
      },
      {
        displayName: 'Analysis Reports',
        iconName: 'fiber_manual_record',
        route: 'report/historical/activations',
      },
      {
        displayName: 'Network Reports',
        iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
        route: 'report/commission-statement',
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
    iconName: 'home',
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
    iconName: 'home',
    route: '',
    children: [
      {
        displayName: 'Payslip',
        iconName: 'file-description',
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
        route: 'shop-commission-cheques',
      },
      {
        displayName: 'Bank Cheques',
        iconName: 'fiber_manual_record',
        route: 'bank-cheques',
      },
    ],
  },
  {
    displayName: 'Communication',
    iconName: 'home',
    route: '',
    children: [
      {
        displayName: 'Chat',
        iconName: 'fiber_manual_record',
        route: 'chat',
      },
      {
        displayName: 'SMS',
        iconName: 'fiber_manual_record',
        route: 'sms',
      },
    ],
  },


  {
    displayName: 'Edit Profile',
    iconName: 'file-description',
    route: 'edit-profile',
  },

];
