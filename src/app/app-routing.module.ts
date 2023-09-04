import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CategoryComponent } from './components/category/category.component';
import { BudgetComponent } from './components/budget/budget.component';

const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'income',
    component: IncomeComponent,
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
    redirectTo: 'expense',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
