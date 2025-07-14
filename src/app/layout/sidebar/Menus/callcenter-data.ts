import { NavItem } from "../nav-item/nav-item";

export const CallCenterItems: NavItem[] = [

  {
    displayName: 'Sim Info',
    iconName: 'manage_search',
    route: 'imei/search',
  },
  {
    displayName: 'OnField',
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
    displayName: 'Bank Cheques',
    iconName: 'checkbook',
    route: 'management/bank-cheques',
  },

  {
    displayName: 'Chat',
    iconName: 'chat',
    route: 'chat',
  },

];