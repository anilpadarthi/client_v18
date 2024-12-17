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
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from './interceptors/app-http.interceptor';
import { SpinnerInterceptor } from '../app/interceptors/spinner.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgScrollbarModule } from 'ngx-scrollbar';


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
    EditUserProfileComponent
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
