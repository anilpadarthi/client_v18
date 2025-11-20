import { NavItem } from "../nav-item/nav-item";

export const HRItems: NavItem[] = [

  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: 'dashboard/main',
  },

  {
    displayName: 'Sim Info',
    iconName: 'manage_search',
    route: 'imei/search',
  },
  {
    displayName: 'User',
    iconName: 'arrow_right',
    route: 'users',
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
    displayName: 'Payslip',
    iconName: 'file-description',
    route: 'management/payslip',
  },
  {
    displayName: 'Change Password',
    iconName: 'lock_reset',
    route: 'change-password',
  },

];