import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CategoryComponent } from './components/category/category.component';
import { BudgetComponent } from './components/budget/budget.component';
import { OverviewReportComponent } from './components/reports/overview-report/overview-report.component';
import { CategoryReportComponent } from './components/reports/category-report/category-report.component';
import { SuperCategoryReportComponent } from './components/reports/super-category-report/super-category-report.component';
import { TrendReportComponent } from './components/reports/trends-report/trends-report.component';
import { SearchReportComponent } from './components/reports/search-report/search-report.component';

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
        component: SearchReportComponent,
      },

      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  {
    path: 'expense',
    component: ExpenseComponent,
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
