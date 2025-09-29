import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from './interceptors/app-http.interceptor';
import { SpinnerInterceptor } from '../app/interceptors/spinner.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


//Import Layouts
import { LayoutComponent } from './layout/layout.component';

// Vertical Layout
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { BrandingComponent } from './layout/sidebar/branding.component';
import { AppNavItemComponent } from './layout/sidebar/nav-item/nav-item.component';
import { AreaListComponent } from './components/area/area-list/area-list.component';
import { AreaEditorComponent } from './components/area/area-editor/area-editor.component';
import { ShopListComponent } from './components/shop/shop-list/shop-list.component';
import { ShopEditorComponent } from './components/shop/shop-editor/shop-editor.component';
import { NetworkListComponent } from './components/network/network-list/network-list.component';
import { NetworkEditorComponent } from './components/network/network-editor/network-editor.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditorComponent } from './components/user/user-editor/user-editor.component';
import { SupplierListComponent } from './components/supplier/supplier-list/supplier-list.component';
import { SupplierEditorComponent } from './components/supplier/supplier-editor/supplier-editor.component';
import { MonthlyActivationReportComponent } from './components/reports/monthly-activation-report/monthly-activation-report.component';
import { HistoricalActivationReportComponent } from './components/reports/historical-activation-report/historical-activation-report.component';
import { SimAllocationReportComponent } from './components/reports/sim-allocation-report/sim-allocation-report.component';
import { KpiTargetReportComponent } from './components/reports/kpi-target-report/kpi-target-report.component';
import { CommissionStatementReportComponent } from './components/reports/commission-statement-report/commission-statement-report.component';
import { DailyReportComponent } from './components/reports/daily-report/daily-report.component';
import { TrackReportComponent } from './components/reports/track-report/track-report.component';
import { MainDashboardComponent } from './components/dashboard/main-dashboard/main-dashboard.component';
import { NetworkActivationsComponent } from './components/dashboard/network-activations/network-activations.component';
import { AgentActivationsComponent } from './components/dashboard/agent-activations/agent-activations.component';
import { AreaActivationsComponent } from './components/dashboard/area-activations/area-activations.component';
import { KpiTargetDetailsComponent } from './components/dashboard/kpi-target-details/kpi-target-details.component';
import { OnFieldComponent } from './components/on-field/on-field.component';
import { OnFieldActivationsComponent } from './components/on-field/on-field-activations/on-field-activations.component';
import { OnFieldInstantActivationsComponent } from './components/on-field/on-field-instant-activations/on-field-instant-activations.component';
import { OnFieldCommissionsComponent } from './components/on-field/on-field-commissions/on-field-commissions.component';
import { OnFieldShopWalletComponent } from './components/on-field/on-field-shop-wallet/on-field-shop-wallet.component';
import { OnFieldShopWalletHistoryComponent } from './components/on-field/on-field-shop-wallet-history/on-field-shop-wallet-history.component';
import { OnFieldShopVisitComponent } from './components/on-field/on-field-shop-visit/on-field-shop-visit.component';
import { OnFieldShopVisitHistoryComponent } from './components/on-field/on-field-shop-visit-history/on-field-shop-visit-history.component';
import { OnFieldScanSimsComponent } from './components/on-field/on-field-scan-sims/on-field-scan-sims.component';
import { OnFieldGivenVsActivationsComponent } from './components/on-field/on-field-given-vs-activations/on-field-given-vs-activations.component';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal/confirmation-modal.component';
import { DynamicTableModalComponent } from './components/shared/dynamic-table-modal/dynamic-table-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NetworkReportComponent } from './components/reports/network-report/network-report.component';
import { BulkUploadComponent } from './components/management/bulk-upload/bulk-upload.component';
import { WhatsappNotificationsComponent } from './components/management/whatsapp-notifications/whatsapp-notifications.component';
import { AgreementNotificationsComponent } from './components/management/agreement-notifications/agreement-notifications.component';
import { ExpensesComponent } from './components/management/expenses/expenses.component';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeGb from '@angular/common/locales/en-GB';
import { PopupTableComponent } from './components/common/popup-table/popup-table.component';
import { AgreementFormEditorComponent } from './components/agreement/agreement-form-editor/agreement-form-editor.component';
import { ExpensesFormEditorComponent } from './components/expenses/expenses-form-editor/expenses-form-editor.component';
import { AllocateAreaToAgentComponent } from './components/allocate/allocate-area-to-agent/allocate-area-to-agent.component';
import { AllocateAgentToManagerComponent } from './components/allocate/allocate-agent-to-manager/allocate-agent-to-manager.component';
import { ImeiSearchComponent } from './components/sim/imei-search/imei-search.component';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { FormatHeaderNamePipe } from './custom/format-header-name-pipe';
import { OnFieldSpamActivationsComponent } from './components/on-field/on-field-spam-activations/on-field-spam-activations.component';
import { PaySlipComponent } from './components/management/pay-slip/pay-slip.component';
import { AttendanceReportComponent } from './components/management/attendance-report/attendance-report.component';
import { ExpensesFormComponent } from './components/management/expenses-form/expenses-form.component';
import { EditUserProfileComponent } from './components/user/edit-user-profile/edit-user-profile.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryEditorComponent } from './components/category/category-editor/category-editor.component';
import { SubCategoryEditorComponent } from './components/sub-category/sub-category-editor/sub-category-editor.component';
import { SubCategoryListComponent } from './components/sub-category/sub-category-list/sub-category-list.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductEditorComponent } from './components/product/product-editor/product-editor.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { OrderPaymentEditorComponent } from './components/order/order-payment-editor/order-payment-editor.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { ProductDetailComponent } from './components/product/product-detail/product-detail.component';
import { ProductsViewComponent } from './components/shopping/products-view/products-view.component';
import { CartItemsComponent } from './components/shopping/cart-items/cart-items.component';
import { CheckoutComponent } from './components/shopping/checkout/checkout.component';
import { CategoryViewComponent } from './components/shopping/category-view/category-view.component';
import { CreateOrderComponent } from './components/order/create-order/create-order.component';
import { EditOrderComponent } from './components/order/edit-order/edit-order.component';
import { CheckOutComponent } from './components/order/check-out/check-out.component';
import { AgentSimOrderComponent } from './components/order/agent-sim-order/agent-sim-order.component';
import { OrderPaymentHistoryComponent } from './components/order/order-payment-history/order-payment-history.component';
import { OutstandingMetricsComponent } from './components/order/outstanding-metrics/outstanding-metrics.component';
import { GroupChatComponent } from './components/chat/group-chat/group-chat.component';
import { AreaCommissionsComponent } from './components/reports/area-commissions/area-commissions.component';
import { MonthlyAccessoriesReportComponent } from './components/reports/monthly-accessories-report/monthly-accessories-report.component';
import { OnFieldShopOrderListComponent } from './components/on-field/on-field-shop-order-list/on-field-shop-order-list.component';
import { MessagePopupComponent } from './components/shared/message-popup/message-popup.component';
import { OpenAccessoriesComponent } from './components/order/open-accessories/open-accessories.component';
import { ChequeWithdrawnReportComponent } from './components/reports/cheque-withdrawn-report/cheque-withdrawn-report.component';
import { AccessoriesSaleComponent } from './components/dashboard/accessories-sale/accessories-sale.component';
import { MonthlyAccessoriesCommissioinPercentReportComponent } from './components/reports/monthly-accessories-commissioin-percent-report/monthly-accessories-commissioin-percent-report.component';
import { OnFieldShopCommissionChequesComponent } from './components/on-field-shop-commission-cheques/on-field-shop-commission-cheques.component';
import { DigitalIdComponent } from './components/digital-id/digital-id.component';
import { RetailerComponent } from './components/retailer/retailer.component';
import { StockComponent } from './components/retailer/stock/stock.component';
import { ActivationsComponent } from './components/retailer/activations/activations.component';
import { CommissionStatementsComponent } from './components/retailer/commission-statements/commission-statements.component';
import { StockConversionComponent } from './components/retailer/stock-conversion/stock-conversion.component';
import { SalesManagerComponent } from './components/retailer/sales-manager/sales-manager.component';
import { ContactusComponent } from './components/retailer/contactus/contactus.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { CommissionChequeStatusComponent } from './components/management/commission-cheque-status/commission-cheque-status.component';
import { MixMatchGroupEditorComponent } from './components/mix-match-group/mix-match-group-editor/mix-match-group-editor.component';
import { MixMatchGroupListComponent } from './components/mix-match-group/mix-match-group-list/mix-match-group-list.component';


registerLocaleData(localeGb, 'en-GB');
// Factory function for the loader
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    BrandingComponent,
    AppNavItemComponent,
    AreaListComponent,
    AreaEditorComponent,
    ShopListComponent,
    ShopEditorComponent,
    NetworkListComponent,
    NetworkEditorComponent,
    UserListComponent,
    UserEditorComponent,
    SupplierListComponent,
    SupplierEditorComponent,
    MonthlyActivationReportComponent,
    HistoricalActivationReportComponent,
    SimAllocationReportComponent,
    KpiTargetReportComponent,
    CommissionStatementReportComponent,
    DailyReportComponent,
    TrackReportComponent,
    MainDashboardComponent,
    NetworkActivationsComponent,
    AgentActivationsComponent,
    AreaActivationsComponent,
    KpiTargetDetailsComponent,
    OnFieldComponent,
    OnFieldActivationsComponent,
    OnFieldInstantActivationsComponent,
    OnFieldCommissionsComponent,
    OnFieldShopWalletComponent,
    OnFieldShopWalletHistoryComponent,
    OnFieldShopVisitComponent,
    OnFieldShopVisitHistoryComponent,
    OnFieldScanSimsComponent,
    OnFieldGivenVsActivationsComponent,
    ConfirmationModalComponent,
    DynamicTableModalComponent,
    NetworkReportComponent,
    BulkUploadComponent,
    WhatsappNotificationsComponent,
    AgreementNotificationsComponent,
    ExpensesComponent,
    PopupTableComponent,
    AgreementFormEditorComponent,
    ExpensesFormEditorComponent,
    AllocateAreaToAgentComponent,
    AllocateAgentToManagerComponent,
    ImeiSearchComponent,
    ConfirmDialogComponent,
    FormatHeaderNamePipe,
    OnFieldSpamActivationsComponent,
    PaySlipComponent,
    AttendanceReportComponent,
    ExpensesFormComponent,
    EditUserProfileComponent,
    CategoryListComponent,
    CategoryEditorComponent,
    SubCategoryEditorComponent,
    SubCategoryListComponent,
    ProductListComponent,
    ProductEditorComponent,
    OrderListComponent,
    OrderPaymentEditorComponent,
    OrderDetailsComponent,
    ProductDetailComponent,
    ProductsViewComponent,
    CartItemsComponent,
    CheckoutComponent,
    CategoryViewComponent,
    CreateOrderComponent,
    EditOrderComponent,
    CheckOutComponent,
    AgentSimOrderComponent,
    OrderPaymentHistoryComponent,
    OutstandingMetricsComponent,
    GroupChatComponent,
    AreaCommissionsComponent,
    MonthlyAccessoriesReportComponent,
    OnFieldShopOrderListComponent,
    MessagePopupComponent,
    OpenAccessoriesComponent,
    ChequeWithdrawnReportComponent,
    AccessoriesSaleComponent,
    MonthlyAccessoriesCommissioinPercentReportComponent,
    OnFieldShopCommissionChequesComponent,
    DigitalIdComponent,
    StockComponent,
    ActivationsComponent,
    CommissionStatementsComponent,
    StockConversionComponent,
    SalesManagerComponent,
    ContactusComponent,
    ChangePasswordComponent,
    CommissionChequeStatusComponent,
    MixMatchGroupListComponent,
    MixMatchGroupEditorComponent,
    RetailerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    NgxMatSelectSearchModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideAnimationsAsync(),
    CurrencyPipe,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
