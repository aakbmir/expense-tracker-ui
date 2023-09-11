import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { BudgetService } from 'src/app/services/budget.service';
import { IncomeService } from 'src/app/services/income.service';
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
  parentCategoryList: any = [];
  categoryList: any = [];
  parentList: any = [];
  parentCategoryDetailsList: any = [];

  categoryDetailsList: any = [];
  parent = '';
  targetBudgetTotal = 0;
  targetExpenseTotal = 0;
  targetDeviateTotal = 0;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private categoryService: CategoryService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private budgetService: BudgetService,
    private reportsService: ReportService,
    private snackBar: MatSnackBar
  ) {
    this.screen = this.data.screen;
    this.parentCategoryList = [];
    this.categoryList = [];
    this.parentList = [];
    this.parentCategoryDetailsList = [];

    this.categoryDetailsList = [];
    this.parent = '';

    if (this.screen === 'fetch-parent-details') {
      this.targetBudgetTotal = 0;
      this.targetExpenseTotal = 0;
      this.targetDeviateTotal = 0;
      this.parent = this.data.item.parent;
      this.reportsService
        .fetchParentCategoryDetails(
          this.data.item.parent,
          this.data.item.month,
          this.data.item.year
        )
        .subscribe((data) => {
          this.parentCategoryDetailsList = data;
          for (let ove of data) {
            this.targetBudgetTotal += ove.budget;
            this.targetExpenseTotal += ove.expense;
            this.targetDeviateTotal += ove.deviate;
          }
        });
    } else if (this.screen === 'fetch-monthly-details') {
      this.targetBudgetTotal = 0;
      this.targetExpenseTotal = 0;
      this.targetDeviateTotal = 0;
      console.log(this.data.item)
      this.parent = this.data.item.parent;
      this.reportsService
        .fetchCategoryDetails(
          this.data.item.parent,
          this.data.item.month,
          this.data.item.year
        )
        .subscribe((data) => {
          this.categoryDetailsList = data;
          for (let ove of data) {
            this.targetBudgetTotal += ove.budget;
            this.targetExpenseTotal += ove.expense;
            this.targetDeviateTotal += ove.deviate;
          }
        });
    } else if (
      this.screen === 'Expense-Add' ||
      this.screen === 'Expense-Edit'
    ) {
      this.categoryService.getAllCategories().subscribe((data) => {
        this.categoryList = data;
        this.parentCategoryList = Array.from(
          new Set(data.map((item: any) => item.parent))
        );
      });
    }
  }

  editCategoryForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    parent: new FormControl(this.data.item.parent, Validators.required),
  });

  addCategoryForm = new FormGroup({
    category: new FormControl('', Validators.required),
    parent: new FormControl('', Validators.required),
  });

  editBudgetForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
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
    parent: new FormControl(this.data.item.parent, Validators.required),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
    note: new FormControl(this.data.item.date, Validators.required),
  });

  editExpenseForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    parent: new FormControl(this.data.item.parent, Validators.required),
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

  addIncome() {
    this.incomeService.saveIncome(this.addIncomeForm.value).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.onCancel();
      }
    );
  }

  editIncome() {
    this.incomeService
      .updateIncome(this.editIncomeForm.value)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  deleteIncome() {
    this.incomeService.deleteIncome(this.data.item.id).subscribe((data) => {
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
