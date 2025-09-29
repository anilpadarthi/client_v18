import { NavItem } from "../nav-item/nav-item";

export const RetailerItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: 'retailer/dashboard',
  },

  {
    displayName: 'Sim Info',
    iconName: 'manage_search',
    route: 'retailer/siminfo',
  },
  {
    displayName: 'Stock',
    iconName: 'manage_search',
    route: 'retailer/stock',
  },  
  {
    displayName: 'Activations',
    iconName: 'manage_search',
    route: 'retailer/activations',
  },  
  {
    displayName: 'Commission Statements',
    iconName: 'manage_search',
    route: 'retailer/commissions',
  },
  {
    displayName: 'Given vs Activations',
    iconName: 'manage_search',
    route: 'retailer/stockvsconnections',
  },    
  {
    displayName: 'Accessories',
    iconName: 'point_of_sale',
    route: '',
    children: [
      {
        displayName: 'Sales',
        iconName: 'arrow_right',
        route: 'retailer/sales',
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
    displayName: 'Your Manager',
    iconName: 'chat',
    route: 'retailer/sales-manager',
  },
  {
    displayName: 'Contact Us',
    iconName: 'chat',
    route: 'retailer/contactus',
  },
  {
    displayName: 'Edit Profile',
    iconName: 'chat',
    route: 'retailer/profile',
  },
  {
    displayName: 'Change Password',
    iconName: 'chat',
    route: 'retailer/changepassword',
  },
];