import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CategoryComponent } from './components/category/category.component';

const routes: Routes = [
  {
    path: "",
    component: ReportsComponent
  },
  {
    path: "reports",
    component: ReportsComponent
  },
  {
    path: "income",
    component: IncomeComponent
  },
  {
    path: "expense",
    component: ExpenseComponent
  },
  {
    path: "category",
    component: CategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
