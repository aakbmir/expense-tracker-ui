import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { BudgetService } from 'src/app/services/budget.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { ReportService } from 'src/app/services/report.service';
import { BankService } from 'src/app/services/bank.service';
import { IncomeService } from 'src/app/services/income.service';
import { CommonService } from 'src/app/services/common.service';
import { SavingsService } from 'src/app/services/savings.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  screen: any;
  feature: any;
  categoryList: any = [];
  months: any = [];
  years: any = [];

  reportsDetailsList: any = [];
  main = '';
  deleteAction: string = '';

  copyCategoriesForm = new FormGroup({
    month: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private savingsService: SavingsService,
    private budgetService: BudgetService,
    private reportsService: ReportService,
    private bankService: BankService,
    private incomeService: IncomeService,
    private commonService: CommonService,
    private snackBar: MatSnackBar) {

    this.screen = this.data.screen;
    console.log('this.screen', this.screen);
    console.log('this.data.item', this.data.item);
    this.categoryList = [];
    this.reportsDetailsList = [];
    this.months = this.commonService.getMonths();
    this.years = this.commonService.getYears();

    this.copyCategoriesForm.patchValue({
      month: this.data?.month || '',
      year: this.data?.year || '',
    });

    if (this.data?.item) {
      this.deleteAction = this.data.item.active ? 'inactive' : 'active';
    }

    this.main = '';
    if (this.screen === 'fetch-sub-category-report-details') {
      this.main = this.data.item.main;
      this.reportsService
        .fetchSubCategoryReportDetails(
          this.data.item.main,
          this.data.item.month,
          this.data.item.year
        )
        .subscribe((data) => {
          this.reportsDetailsList = data;
          console.log(
            'this.fetchSubCategoryReportDetails',
            this.reportsDetailsList
          );
        });
    } else if (this.screen === 'fetch-category-report-details') {
      this.main = this.data.item.main;
      this.reportsService
        .fetchCategoryReportDetails(
          this.data.item.main,
          this.data.item.month,
          this.data.item.year
        )
        .subscribe((data) => {
          this.reportsDetailsList = data;
          console.log('this.reportsDetailsList', this.reportsDetailsList);
        });
    } else if (
      this.screen === 'Expense-Add' ||
      this.screen === 'Expense-Edit') {

      this.categoryService.getAllCategories(this.data.month, this.data.year, false, "Category").subscribe((data: any) => {
        this.categoryList = this.flattenCategories(data?.financialTypes || []);
      });
    } else if (
      this.screen === 'Savings-Add' ||
      this.screen === 'Savings-Edit') {

      this.categoryService.getAllCategories(this.data.month, this.data.year, false, "Expense").subscribe((data: any) => {
        this.categoryList = this.flattenCategories(data?.financialTypes || []);
      });
    }
  }

  flattenCategories(financialTypes: any[]): any[] {
    const flatList: any[] = [];
    if (!financialTypes) return flatList;
    financialTypes.forEach((ft: any) => {
      (ft.mainCategories || []).forEach((mc: any) => {
        (mc.superCategories || []).forEach((sc: any) => {
          (sc.categories || []).forEach((c: any) => {
            flatList.push({
              categoryId: c.categoryId,
              category: c.categoryName,
              superCategory: sc.superCategory,
              mainCategory: mc.mainCategory,
              categoryGroup: c.categoryGroup,
              status: c.status,
              budgetAmount: c.budgetAmount
            });
          });
        });
      });
    });
    return flatList;
  }

  editCategoryForm = new FormGroup({
    financialType: new FormControl(this.data.item.financialType, Validators.required),
    categoryGroup: new FormControl(this.data.item.categoryGroup, Validators.required),
    mainCategory: new FormControl(this.data.item.mainCategory, Validators.required),
    superCategory: new FormControl(this.data.item.superCategory, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    categoryId: new FormControl(this.data.item.categoryId, Validators.required),
    budgetAmount: new FormControl(this.data.item.budgetAmount, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
    status: new FormControl(this.data.item.status, Validators.required),
  });

  addCategoryForm = new FormGroup({
    financialType: new FormControl('EXPENSE', Validators.required),
    categoryGroup: new FormControl('', Validators.required),
    mainCategory: new FormControl('', Validators.required),
    superCategory: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    budgetAmount: new FormControl('', Validators.required),
    status: new FormControl('ACTIVE', Validators.required),
    date: new FormControl<Date | null>(null, Validators.required),
  });

  addCategory() {
    // ensure selected date keeps chosen day but use current time
    const dateControl = this.addCategoryForm.get('date');
    if (dateControl && dateControl.value) {
      const selected = new Date(dateControl.value);
      const now = new Date();
      selected.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
      const fv: any = this.addCategoryForm.value;
      const payload: any = {
        financialType: fv.financialType,
        categoryGroup: fv.categoryGroup,
        mainCategory: fv.mainCategory,
        superCategory: fv.superCategory,
        category: fv.category,
        budgetAmount: fv.budgetAmount,
        date: selected,
        status: fv.status
      };
      this.categoryService.saveCategory(payload).subscribe(
        (data) => {
          this.dialogRef.close(true);
        },
        (error) => {
          this.onCancel();
        }
      );
      return;
    }

    this.categoryService.saveCategory(this.addCategoryForm.value).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.onCancel();
      }
    );
  }

  copyCategories() {
    const month = this.copyCategoriesForm.value.month;
    const year = this.copyCategoriesForm.value.year;
    this.categoryService.addAllCategories(month, year).subscribe(
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
    const action = this.deleteAction;
    this.categoryService.deleteCategory(this.data.item.categoryId, action).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  editBudgetForm = new FormGroup({
    budgetId: new FormControl(this.data.item.budgetId, Validators.required),
    categoryId: new FormControl(this.data.item.categoryId, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    mainCategory: new FormControl(
      this.data.item.mainCategory,
      Validators.required
    ),
    superCategory: new FormControl(
      this.data.item.superCategory,
      Validators.required
    ),
    categoryGroup: new FormControl(this.data.item.categoryGroup, Validators.required),
    budgetAmount: new FormControl(this.data.item.budgetAmount, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
  });

  editBudget() {
    let budget = {
      "budgetId": this.editBudgetForm.get("budgetId").value,
      "categoryApiDTO": {
        "categoryId": this.editBudgetForm.get("categoryId").value,
        "category": this.editBudgetForm.get("category").value,
        "mainCategory": this.editBudgetForm.get("mainCategory").value,
        "superCategory": this.editBudgetForm.get("superCategory").value,
        "categoryGroup": this.editBudgetForm.get("categoryGroup").value,
        "date": this.editBudgetForm.get("date").value
      },
      "budgetAmount": Number(this.editBudgetForm.get("budgetAmount").value),
      "date": this.editBudgetForm.get("date").value
    }
    this.budgetService.updateBudget(budget)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  addIncomeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),

    note: new FormControl('', Validators.required),
  });

  editIncomeForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    name: new FormControl(this.data.item.name, Validators.required),
    category: new FormControl(this.data.item.category, Validators.required),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
    note: new FormControl(this.data.item.note, Validators.required),
  });

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

  addExpenseForm = new FormGroup({
    expenseId: new FormControl(this.data.item.expenseId, Validators.required),
    categoryId: new FormControl(this.data.item?.categoryApiDTO?.categoryId, Validators.required),
    categoryGroup: new FormControl(this.data.item?.categoryApiDTO?.categoryGroup, Validators.required),
    mainCategory: new FormControl(this.data.item?.categoryApiDTO?.mainCategory, Validators.required),
    superCategory: new FormControl(this.data.item?.categoryApiDTO?.superCategory, Validators.required),
    category: new FormControl(this.data.item?.categoryApiDTO?.category, Validators.required),
    amount: new FormControl(this.data.item?.amount, Validators.required),
    date: new FormControl(new Date(this.data.item?.date), Validators.required),
    description: new FormControl(this.data.item?.description, Validators.required)
  });

  editExpenseForm = new FormGroup({
    expenseId: new FormControl(this.data.item.expenseId, Validators.required),
    categoryId: new FormControl(this.data.item?.categoryApiDTO?.categoryId, Validators.required),
    category: new FormControl(this.data.item?.categoryApiDTO?.category, Validators.required),
    mainCategory: new FormControl(
      this.data.item?.categoryApiDTO?.mainCategory,
      Validators.required
    ),
    superCategory: new FormControl(
      this.data.item?.categoryApiDTO?.superCategory,
      Validators.required
    ),
    categoryGroup: new FormControl(this.data.item?.categoryApiDTO?.categoryGroup, Validators.required),
    amount: new FormControl(this.data.item?.amount, Validators.required),
    date: new FormControl(new Date(this.data.item?.date), Validators.required),
    description: new FormControl(this.data.item?.description, Validators.required),
    miscellaneous: new FormControl(this.data.item?.miscellaneous, Validators.required),
  });

  addExpense() {
    let expense = {
      "expenseId": this.addExpenseForm.get("expenseId").value,
      "categoryId": this.addExpenseForm.get("categoryId").value,
      "amount": Number(this.addExpenseForm.get("amount").value),
      "date": this.addExpenseForm.get("date").value,
      "description": this.addExpenseForm.get("description").value,
      "miscellaneous": false
    }

    this.expenseService.saveExpense(expense).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.onCancel();
      }
    );
  }

  onCategoryChange(categoryId: string) {
    const selectedCategoryId = Number(categoryId);
    const selectedCategory = this.categoryList.find(
      (category: any) => category.categoryId === selectedCategoryId
    );

    console.log('sele', selectedCategory);
    if (selectedCategory) {
      this.addExpenseForm.patchValue({
        category: selectedCategory.category,
        categoryId: selectedCategory.categoryId,
        mainCategory: selectedCategory.mainCategory,
        superCategory: selectedCategory.superCategory,
        categoryGroup: selectedCategory.categoryGroup,
      });
    }
  }

  onCategorySavingsChange(categoryId: string) {
    const selectedCategoryId = Number(categoryId);
    const selectedCategory = this.categoryList.find(
      (category: any) => category.categoryId === selectedCategoryId
    );

    console.log('sele', selectedCategory);
    if (selectedCategory) {
      this.addSavingsForm.patchValue({
        category: selectedCategory.category,
        categoryId: selectedCategory.categoryId,
        mainCategory: selectedCategory.mainCategory,
        superCategory: selectedCategory.superCategory,
        categoryGroup: selectedCategory.categoryGroup,
      });
    }
  }

  onCategoryEditChange(categoryId: string) {
    console.log('categoryId', categoryId);
    const selectedCategoryId = Number(categoryId);
    const selectedCategory = this.categoryList.find(
      (category: any) => category.categoryId === selectedCategoryId
    );

    console.log('sele', selectedCategory);
    if (selectedCategory) {
      this.editExpenseForm.patchValue({
        category: selectedCategory.category,
        categoryId: selectedCategory.categoryId,
        mainCategory: selectedCategory.mainCategory,
        superCategory: selectedCategory.superCategory,
        categoryGroup: selectedCategory.categoryGroup,
      });
    }
  }

  editExpense() {
    console.log('this.editExpenseForm.value', this.editExpenseForm.value);
    let expense = {
      "expenseId": this.editExpenseForm.get("expenseId").value,
      "categoryApiDTO": {
        "categoryId": this.editExpenseForm.get("categoryId").value,
        "category": this.editExpenseForm.get("category").value,
        "mainCategory": this.editExpenseForm.get("mainCategory").value,
        "superCategory": this.editExpenseForm.get("superCategory").value,
        "categoryGroup": this.editExpenseForm.get("categoryGroup").value,
        "date": this.editExpenseForm.get("date").value
      },
      "amount": Number(this.editExpenseForm.get("amount").value),
      "date": this.editExpenseForm.get("date").value,
      "description": this.editExpenseForm.get("description").value,
      "miscellaneous": this.editExpenseForm.get("miscellaneous").value
    }
    this.expenseService
      .updateExpense(expense)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  deleteExpense() {
    this.expenseService.deleteExpense(this.data.item.expenseId).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  addSavingsForm = new FormGroup({
    savingsId: new FormControl(this.data.item.savingsId, Validators.required),
    categoryId: new FormControl(this.data.item?.categoryApiDTO?.categoryId, Validators.required),
    categoryGroup: new FormControl(this.data.item?.categoryApiDTO?.categoryGroup, Validators.required),
    mainCategory: new FormControl(this.data.item?.categoryApiDTO?.mainCategory, Validators.required),
    superCategory: new FormControl(this.data.item?.categoryApiDTO?.superCategory, Validators.required),
    category: new FormControl(this.data.item?.categoryApiDTO?.category, Validators.required),
    amount: new FormControl(this.data.item?.amount, Validators.required),
    date: new FormControl(new Date(this.data.item?.date), Validators.required),
    description: new FormControl(this.data.item?.description, Validators.required)
  });

  editSavingsForm = new FormGroup({
    savingsId: new FormControl(this.data.item.savingsId, Validators.required),
    categoryId: new FormControl(this.data.item?.categoryApiDTO?.categoryId, Validators.required),
    category: new FormControl(this.data.item?.categoryApiDTO?.category, Validators.required),
    mainCategory: new FormControl(
      this.data.item?.categoryApiDTO?.mainCategory,
      Validators.required
    ),
    superCategory: new FormControl(
      this.data.item?.categoryApiDTO?.superCategory,
      Validators.required
    ),
    categoryGroup: new FormControl(this.data.item?.categoryApiDTO?.categoryGroup, Validators.required),
    amount: new FormControl(this.data.item?.amount, Validators.required),
    date: new FormControl(new Date(this.data.item?.date), Validators.required),
    description: new FormControl(this.data.item?.description, Validators.required),
    miscellaneous: new FormControl(this.data.item?.miscellaneous, Validators.required),
  });

  addSavings() {
    let savings = {
      "savingsId": this.addSavingsForm.get("savingsId").value,
      "categoryId": this.addSavingsForm.get("categoryId").value,
      "amount": Number(this.addSavingsForm.get("amount").value),
      "date": this.addSavingsForm.get("date").value,
      "description": this.addSavingsForm.get("description").value,
      "miscellaneous": false
    }

    this.savingsService.saveSavings(savings).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.onCancel();
      }
    );
  }


  editSavings() {
    console.log('this.editSavingsForm.value', this.editSavingsForm.value);
    let savings = {
      "savingsId": this.editSavingsForm.get("savingsId").value,
      "categoryApiDTO": {
        "categoryId": this.editSavingsForm.get("categoryId").value,
        "category": this.editSavingsForm.get("category").value,
        "mainCategory": this.editSavingsForm.get("mainCategory").value,
        "superCategory": this.editSavingsForm.get("superCategory").value,
        "categoryGroup": this.editSavingsForm.get("categoryGroup").value,
        "date": this.editSavingsForm.get("date").value
      },
      "amount": Number(this.editSavingsForm.get("amount").value),
      "date": this.editSavingsForm.get("date").value,
      "description": this.editSavingsForm.get("description").value,
      "miscellaneous": this.editSavingsForm.get("miscellaneous").value
    }

    console.log(savings);
    this.savingsService
      .updateSavings(savings)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  deleteSavings() {
    this.savingsService.deleteSavings(this.data.item.savingsId).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  addBankRecordForm = new FormGroup({
    name: new FormControl(this.data.item.name, Validators.required),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
  });

  editBankRecordForm = new FormGroup({
    id: new FormControl(this.data.item.id, Validators.required),
    name: new FormControl(this.data.item.name, Validators.required),
    price: new FormControl(this.data.item.price, Validators.required),
    date: new FormControl(this.data.item.date, Validators.required),
  });

  addBankRecord() {
    this.bankService.saveBankRecord(this.addBankRecordForm.value).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.onCancel();
      }
    );
  }

  editBankRecord() {
    this.bankService
      .updateBankRecord(this.editBankRecordForm.value)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  deleteBankRecord() {
    this.bankService.deleteBankRecord(this.data.item.id).subscribe((data) => {
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
