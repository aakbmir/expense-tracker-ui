import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { ExpenseComponent } from './components/features/expense/expense.component';
import { IncomeComponent } from './components/features/income/income.component';
import { CategoryComponent } from './components/features/category/category.component';
import { OverviewReportComponent } from './components/reports/overview-report/overview-report.component';
import { CategoryReportComponent } from './components/reports/category-report/category-report.component';
import { TrendReportComponent } from './components/reports/trends-report/trends-report.component';
import { SavingsReportComponent } from './components/reports/savings-report/savings-report.component';
import { GroupReportComponent } from './components/reports/group-report/group-report.component';

import { HomeComponent } from './components/layout/home/home.component';
import { SavingsComponent } from './components/features/savings/savings.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
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
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  {
    path: 'expense',
    component: ExpenseComponent,
  },
  {
    path: 'income',
    component: IncomeComponent,
  },
  {
    path: 'savings',
    component: SavingsComponent,
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
