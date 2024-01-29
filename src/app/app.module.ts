import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CategoryComponent } from './components/category/category.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BudgetComponent } from './components/budget/budget.component';

import { NgChartsModule } from 'ng2-charts';
import { AppConfigService } from './providers/app-config.service';
import { KeysPipe } from './pipes/keys.pipe';
import { OverviewReportComponent } from './components/reports/overview-report/overview-report.component';
import { CategoryReportComponent } from './components/reports/category-report/category-report.component';
import { GroupReportComponent } from './components/reports/group-report/group-report.component';
import { TrendReportComponent } from './components/reports/trends-report/trends-report.component';
import { SavingsReportComponent } from './components/reports/savings-report/savings-report.component';
import { BankComponent } from './components/bank/bank.component';
import { BankReportComponent } from './components/reports/bank-report/bank-report.component';

export function initConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    ExpenseComponent,
    CategoryComponent,
    ReportsComponent,
    DialogComponent,
    BudgetComponent,
    FooterComponent,
    KeysPipe,
    OverviewReportComponent,
    CategoryReportComponent,
    GroupReportComponent,
    TrendReportComponent,
    SavingsReportComponent,
    BankComponent,
    BankReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    NgChartsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
