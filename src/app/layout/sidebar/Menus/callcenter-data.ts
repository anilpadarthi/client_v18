import { NavItem } from "../nav-item/nav-item";

export const CallCenterItems: NavItem[] = [

  {
    displayName: 'Sim Info',
    iconName: 'manage_search',
    route: 'imei/search',
  },
  {
    displayName: 'On-Field',
    iconName: 'store',
    route: 'onfield',
  },
  {
    displayName: 'Shop',
    iconName: 'storefront',
    route: 'shops',
  },
  {
    displayName: 'Uploads',
    iconName: 'upload',
    route: 'management/bulk-upload',
  },
  {
    displayName: 'WhatsApp Reports',
    iconName: 'receipt',
    route: 'management/whatsapp',
  },
  {
    displayName: 'Sales',
    iconName: 'orders',
    route: 'accessories/sales',
  },
  {
        displayName: 'Commission Cheque Status',
        iconName: 'checkbook',
        route: 'commission-cheque-status',
  },
  {
    displayName: 'Payslip',
    iconName: 'receipt',
    route: 'management/payslip',
  },

  {
    displayName: 'Chat',
    iconName: 'chat',
    route: 'chat',
  },

];