import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RetailerLoginComponent } from './components/login/retailer-login/retailer-login.component';
import { HomeComponent } from './components/home/home.component';
import { AreaListComponent } from './components/area/area-list/area-list.component';
import { AreaEditorComponent } from './components/area/area-editor/area-editor.component';
import { ShopEditorComponent } from './components/shop/shop-editor/shop-editor.component';
import { ShopListComponent } from './components/shop/shop-list/shop-list.component';
import { NetworkListComponent } from './components/network/network-list/network-list.component';
import { NetworkEditorComponent } from './components/network/network-editor/network-editor.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditorComponent } from './components/user/user-editor/user-editor.component';
import { SupplierListComponent } from './components/supplier/supplier-list/supplier-list.component';
import { SupplierEditorComponent } from './components/supplier/supplier-editor/supplier-editor.component';
import { AuthGuard } from '../app/services/authguard';
import { LayoutComponent } from './layout/layout.component';
import { MonthlyActivationReportComponent } from './components/reports/monthly-activation-report/monthly-activation-report.component';
import { HistoricalActivationReportComponent } from './components/reports/historical-activation-report/historical-activation-report.component';
import { SimAllocationReportComponent } from './components/reports/sim-allocation-report/sim-allocation-report.component';
import { KpiTargetReportComponent } from './components/reports/kpi-target-report/kpi-target-report.component';
import { CommissionStatementReportComponent } from './components/reports/commission-statement-report/commission-statement-report.component';
import { DailyReportComponent } from './components/reports/daily-report/daily-report.component';
import { TrackReportComponent } from './components/reports/track-report/track-report.component';
import { MainDashboardComponent } from './components/dashboard/main-dashboard/main-dashboard.component';
import { OnFieldComponent } from './components/on-field/on-field.component';
import { NetworkReportComponent } from './components/reports/network-report/network-report.component';
import { AllocateAreaToAgentComponent } from './components/allocate/allocate-area-to-agent/allocate-area-to-agent.component';
import { AllocateAgentToManagerComponent } from './components/allocate/allocate-agent-to-manager/allocate-agent-to-manager.component';
import { ImeiSearchComponent } from './components/sim/imei-search/imei-search.component';
import { BulkUploadComponent } from './components/management/bulk-upload/bulk-upload.component';
import { WhatsappNotificationsComponent } from './components/management/whatsapp-notifications/whatsapp-notifications.component';
import { PaySlipComponent } from './components/management/pay-slip/pay-slip.component';
import { ExpensesComponent } from './components/management/expenses/expenses.component';
import { ExpensesFormComponent } from './components/management/expenses-form/expenses-form.component';
import { AttendanceReportComponent } from './components/management/attendance-report/attendance-report.component';
import { EditUserProfileComponent } from './components/user/edit-user-profile/edit-user-profile.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryEditorComponent } from './components/category/category-editor/category-editor.component';
import { SubCategoryListComponent } from './components/sub-category/sub-category-list/sub-category-list.component';
import { SubCategoryEditorComponent } from './components/sub-category/sub-category-editor/sub-category-editor.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductEditorComponent } from './components/product/product-editor/product-editor.component';
import { CreateOrderComponent } from './components/order/create-order/create-order.component';
import { EditOrderComponent } from './components/order/edit-order/edit-order.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { AgentSimOrderComponent } from './components/order/agent-sim-order/agent-sim-order.component';
import { AgreementNotificationsComponent } from './components/management/agreement-notifications/agreement-notifications.component';
import { GroupChatComponent } from './components/chat/group-chat/group-chat.component';
import { AreaCommissionsComponent } from './components/reports/area-commissions/area-commissions.component';
import { MonthlyAccessoriesReportComponent } from './components/reports/monthly-accessories-report/monthly-accessories-report.component';
import { OpenAccessoriesComponent } from './components/order/open-accessories/open-accessories.component';
import { ChequeWithdrawnReportComponent } from './components/reports/cheque-withdrawn-report/cheque-withdrawn-report.component';
import { MonthlyAccessoriesCommissioinPercentReportComponent } from './components/reports/monthly-accessories-commissioin-percent-report/monthly-accessories-commissioin-percent-report.component';
import { CommissionChequeStatusComponent } from './components/management/commission-cheque-status/commission-cheque-status.component';
import { DigitalIdComponent } from './components/digital-id/digital-id.component';
import { MixMatchGroupEditorComponent } from './components/mix-match-group/mix-match-group-editor/mix-match-group-editor.component';
import { MixMatchGroupListComponent } from './components/mix-match-group/mix-match-group-list/mix-match-group-list.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { RetailerComponent } from './components/retailer/retailer.component';
import { StockComponent } from './components/retailer/stock/stock.component';
import { ActivationsComponent } from './components/retailer/activations/activations.component';
import { CommissionStatementsComponent } from './components/retailer/commission-statements/commission-statements.component';
import { StockConversionComponent } from './components/retailer/stock-conversion/stock-conversion.component';
import { SalesManagerComponent } from './components/retailer/sales-manager/sales-manager.component';
import { ContactusComponent } from './components/retailer/contactus/contactus.component';
import { EditProfileComponent } from './components/retailer/edit-profile/edit-profile.component';
import { StockEntryListComponent } from './components/product/stock-entry-list/stock-entry-list.component';
import { StockEntryEditorComponent } from './components/product/stock-entry-editor/stock-entry-editor.component';
import { RetailerOrderListComponent } from './components/retailer/retailer-order-list/retailer-order-list.component';
import { GivenVsActivationsComponent } from './components/retailer/given-vs-activations/given-vs-activations.component';
import { BundleProductEditorComponent } from './components/product/bundle-product-editor/bundle-product-editor.component';
import { InstantActivationReportComponent } from './components/reports/instant-activation-report/instant-activation-report.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { ShopportalComponent } from './components/shopportal/shopportal.component';


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'retailer/login', component: RetailerLoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'global-search', component: GlobalSearchComponent },

      { path: 'areas', component: AreaListComponent },
      { path: 'area/create', component: AreaEditorComponent },
      { path: 'area/edit/:id', component: AreaEditorComponent },

      { path: 'shops', component: ShopListComponent },
      { path: 'shop/create', component: ShopEditorComponent },
      { path: 'shop/edit/:id', component: ShopEditorComponent },

      { path: 'networks', component: NetworkListComponent },
      { path: 'network/create', component: NetworkEditorComponent },
      { path: 'network/edit/:id', component: NetworkEditorComponent },

      { path: 'users', component: UserListComponent },
      { path: 'user/create', component: UserEditorComponent },
      { path: 'user/edit/:id', component: UserEditorComponent },

      { path: 'suppliers', component: SupplierListComponent },
      { path: 'supplier/create', component: SupplierEditorComponent },
      { path: 'supplier/edit/:id', component: SupplierEditorComponent },

      { path: 'categories', component: CategoryListComponent },
      { path: 'category/create', component: CategoryEditorComponent },
      { path: 'category/edit/:id', component: CategoryEditorComponent },

      { path: 'mix-match-groups', component: MixMatchGroupListComponent },
      { path: 'mix-match-groups/create', component: MixMatchGroupEditorComponent },
      { path: 'mix-match-groups/edit/:id', component: MixMatchGroupEditorComponent },


      { path: 'sub-categories', component: SubCategoryListComponent },
      { path: 'sub-category/create', component: SubCategoryEditorComponent },
      { path: 'sub-category/edit/:id', component: SubCategoryEditorComponent },


      { path: 'products', component: ProductListComponent },
      { path: 'product/create', component: ProductEditorComponent },
      { path: 'product/edit/:id', component: ProductEditorComponent },
      { path: 'product/bundle/create', component: BundleProductEditorComponent },
      { path: 'product/bundle/edit/:id', component: BundleProductEditorComponent },
      { path: 'invoice/list', component: StockEntryListComponent },
      { path: 'invoice/create', component: StockEntryEditorComponent },
      { path: 'invoice/:id', component: StockEntryEditorComponent },


      { path: 'onfield', component: OnFieldComponent },
      { path: 'onfield/:areaId/:shopId', component: OnFieldComponent },
      { path: 'report/track', component: TrackReportComponent },
      { path: 'report/monthly/activations', component: MonthlyActivationReportComponent },
      { path: 'report/historical/activations', component: HistoricalActivationReportComponent },
      { path: 'report/instant-report', component: InstantActivationReportComponent },
      { path: 'report/network-report', component: NetworkReportComponent },
      { path: 'report/simallocation-report', component: SimAllocationReportComponent },
      { path: 'report/kpi-target', component: KpiTargetReportComponent },
      { path: 'report/commission-statement', component: CommissionStatementReportComponent },
      { path: 'report/monthly-accessories-report', component: MonthlyAccessoriesReportComponent },
      { path: 'report/monthly-accessories-commision-percent-report', component: MonthlyAccessoriesCommissioinPercentReportComponent },
      { path: 'report/area-commissions', component: AreaCommissionsComponent },
      { path: 'report/daily-report', component: DailyReportComponent },
      { path: 'management/payslip', component: PaySlipComponent },
      { path: 'management/attendance-report', component: AttendanceReportComponent },
      { path: 'management/bulk-upload', component: BulkUploadComponent },
      { path: 'management/whatsapp', component: WhatsappNotificationsComponent },
      { path: 'management/agreement-requests', component: AgreementNotificationsComponent },
      { path: 'management/commission-tier-requests', component: AgreementNotificationsComponent },
      { path: 'management/expenses', component: ExpensesComponent },
      { path: 'management/expenses-form', component: ExpensesFormComponent },
      { path: 'management/revenue', component: ExpensesFormComponent },
      { path: 'commission-cheque-status', component: CommissionChequeStatusComponent },
      { path: 'management/bank-cheques', component: ExpensesFormComponent },
      { path: 'management/commission-cheque-withdraw', component: ChequeWithdrawnReportComponent },
      { path: 'profile/edit', component: EditUserProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },


      { path: 'dashboard/main', component: MainDashboardComponent },
      { path: 'allocatearea', component: AllocateAreaToAgentComponent },
      { path: 'allocateagent', component: AllocateAgentToManagerComponent },
      { path: 'imei/search', component: ImeiSearchComponent },



      { path: 'accessories/sales', component: OrderListComponent },
      { path: 'digitalId', component: DigitalIdComponent },

      { path: 'chat', component: GroupChatComponent },




      { path: 'retailer/dashboard', component: RetailerComponent },
      { path: 'retailer/siminfo', component: ImeiSearchComponent },
      { path: 'retailer/stock', component: StockComponent },
      { path: 'retailer/activations', component: ActivationsComponent },
      { path: 'retailer/commissions', component: CommissionStatementsComponent },
      { path: 'retailer/stockvsconnections', component: GivenVsActivationsComponent },
      { path: 'retailer/sales', component: RetailerOrderListComponent },
      { path: 'retailer/sales-manager', component: SalesManagerComponent },
      { path: 'retailer/profile', component: EditProfileComponent },
      { path: 'retailer/changepassword', component: ChangePasswordComponent },
      { path: 'retailer/contactus', component: ContactusComponent },

    ],
  },
  { path: 'retailer/shopportal/:id', component: ShopportalComponent, canActivate: [AuthGuard], },
  { path: 'accessories/create-order/:id/:type', component: CreateOrderComponent, canActivate: [AuthGuard], },
  { path: 'accessories/edit-order/:id', component: EditOrderComponent, canActivate: [AuthGuard], },
  { path: 'accessories/sim-request', component: AgentSimOrderComponent, canActivate: [AuthGuard], },
  { path: 'accessories/list', component: OpenAccessoriesComponent, canActivate: [AuthGuard], },
  { path: 'retailer/accessories/create-order/:id/:type', component: CreateOrderComponent, canActivate: [AuthGuard], },


  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
