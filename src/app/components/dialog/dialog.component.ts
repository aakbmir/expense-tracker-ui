import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { BudgetService } from 'src/app/services/budget.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  screen: any;
  feature: any;
  categoryList: any = [];

  reportsDetailsList: any = [];
  parent = '';

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private budgetService: BudgetService,
    private reportsService: ReportService,
    private snackBar: MatSnackBar
  ) {
    this.screen = this.data.screen;
    console.log(this.screen);
    console.log(this.data.item);
    this.categoryList = [];
    this.reportsDetailsList = [];

    this.parent = '';
    if (this.screen === 'fetch-super-category-report-details') {
      this.parent = this.data.item.parent;
      console.log(this.parent);
      this.reportsService
        .fetchSuperCategoryReportDetails(
          this.data.item.parent,
          this.data.item.month,
          this.data.item.year
        )
        .subscribe((data) => {
          this.reportsDetailsList = data;
          console.log(
            'this.fetchSuperCategoryReportDetails',
            this.reportsDetailsList
          );
        });
    } else if (this.screen === 'fetch-category-report-details') {
      this.parent = this.data.item.parent;
      this.reportsService
        .fetchCategoryReportDetails(
          this.data.item.parent,
          this.data.item.month,
          this.data.item.year
        )
        .subscribe((data) => {
          this.reportsDetailsList = data;
          console.log(
            'this.reportsDetailsList',
            this.reportsDetailsList
          );
        });
    } else if (
      this.screen === 'Expense-Add' ||
      this.screen === 'Expense-Edit'
    ) {
      console.log(this.data.item);
      this.categoryService.getAllCategories().subscribe((data) => {
        this.categoryList = data;
        // this.parentCategoryList = Array.from(
        //   new Set(data.map((item: any) => item.parent))
        // );
      });
    }
  }

  editCategoryForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    superCategory: new FormControl(
      this.data.item.superCategory,
      Validators.required
    ),
    parentCategory: new FormControl(
      this.data.item.parentCategory,
      Validators.required
    ),
  });

  addCategoryForm = new FormGroup({
    category: new FormControl('', Validators.required),
    parentCategory: new FormControl('', Validators.required),
    superCategory: new FormControl('', Validators.required),
  });

  editBudgetForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    parentCategory: new FormControl(
      this.data.item.parentCategory,
      Validators.required
    ),
    superCategory: new FormControl(
      this.data.item.superCategory,
      Validators.required
    ),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
  });

  addIncomeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required),
  });

  editIncomeForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    name: new FormControl(this.data.item.name, Validators.required),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
    note: new FormControl(this.data.item.note, Validators.required),
  });

  addExpenseForm = new FormGroup({
    category: new FormControl(this.data.item.category, Validators.required),
    completed: new FormControl(this.data.item.completed, Validators.required),
    parent: new FormControl(this.data.item.parent, Validators.required),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
    note: new FormControl(this.data.item.date, Validators.required),
  });

  editExpenseForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    completed: new FormControl(this.data.item.completed, Validators.required),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
    note: new FormControl(this.data.item.note, Validators.required),
  });

  addCategory() {
    this.categoryService.saveCategory(this.addCategoryForm.value).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.onCancel();
      }
    );
  }

  updateCategory() {
    this.categoryService
      .updateCategory(this.editCategoryForm.value)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  deleteCategory() {
    console.log(this.data.item.id);
    this.categoryService.deleteCategory(this.data.item.id).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  editBudget() {
    this.budgetService
      .updateBudget(this.editBudgetForm.value)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  addExpense() {
    this.expenseService.saveExpense(this.addExpenseForm.value).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.onCancel();
      }
    );
  }

  editExpense() {
    this.expenseService
      .updateExpense(this.editExpenseForm.value)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  deleteExpense() {
    this.expenseService.deleteExpense(this.data.item.id).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  openSnackBar() {
    this.snackBar.openFromComponent(DialogComponent, {
      duration: 1500,
    });
  }
}
