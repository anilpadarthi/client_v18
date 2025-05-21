import { NavItem } from "../nav-item/nav-item";

export const ManagerItems: NavItem[] = [

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
        iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
        route: 'report/monthly/activations',
      },
      {
        displayName: 'Analysis Reports',
        iconName: 'fiber_manual_record',
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
        iconName: 'fiber_manual_record',
        route: 'areas',
      },
      {
        displayName: 'Shop',
        iconName: 'fiber_manual_record',
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
    displayName: 'Accessories',
    iconName: 'point_of_sale',
    route: '',
    children: [
      {
        displayName: 'Sales',
        iconName: 'fiber_manual_record',
        route: 'accessories/sales',
      },
      {
        displayName: 'Create Order',
        iconName: 'fiber_manual_record',
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