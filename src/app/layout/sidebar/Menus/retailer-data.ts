import { NavItem } from "../nav-item/nav-item";

export const RetailerItems: NavItem[] = [

  {
    displayName: 'Stock',
    iconName: 'sim_card',
    route: 'retailer/stock',
  },
  {
    displayName: 'Activations',
    iconName: 'table_rows',
    route: 'retailer/activations',
  },
  {
    displayName: 'Commission Statements',
    iconName: 'download',
    route: 'retailer/commissions',
  },
  {
    displayName: 'Given vs Activations',
    iconName: 'compare',
    route: 'retailer/stockvsconnections',
  },
  {
    displayName: 'Sales',
    iconName: 'view_list',
    route: 'retailer/sales',
  },
  {
    displayName: 'Accessories',
    iconName: 'arrow_right',
    route: 'retailer/accessories/create-order',
    target: '_blank',
  },


  {
    displayName: 'Edit Profile',
    iconName: 'edit',
    route: 'retailer/profile',
  },
  {
    displayName: 'Change Password',
    iconName: 'password',
    route: 'retailer/changepassword',
  },
];