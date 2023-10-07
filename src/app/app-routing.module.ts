import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CategoryComponent } from './components/category/category.component';
import { BudgetComponent } from './components/budget/budget.component';
import { OverviewReportComponent } from './components/reports/overview-report/overview-report.component';
import { CategoryReportComponent } from './components/reports/category-report/category-report.component';
import { TrendReportComponent } from './components/reports/trends-report/trends-report.component';
import { SavingsReportComponent } from './components/reports/savings-report/savings-report.component';
import { GroupReportComponent } from './components/reports/group-report/group-report.component';
import { BankComponent } from './components/bank/bank.component';
import { BankReportComponent } from './components/reports/bank-report/bank-report.component';

const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
    children: [
      {
        path: 'overview',
        component: OverviewReportComponent,
      },
      {
        path: 'category',
        component: CategoryReportComponent,
      },
      {
        path: 'trend',
        component: TrendReportComponent,
      },
      {
        path: 'search',
        component: SavingsReportComponent,
      },
      {
        path: 'group',
        component: GroupReportComponent
      },
      {
        path: 'bank',
        component: BankReportComponent
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  {
    path: 'expense',
    component: ExpenseComponent,
  },
  {
    path: 'bank',
    component: BankComponent,
  },
  {
    path: 'budget',
    component: BudgetComponent,
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
