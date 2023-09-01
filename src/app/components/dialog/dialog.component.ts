import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import { BudgetService } from 'src/app/services/budget.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  screen: any;
  feature: any;
  umbrellaCategoryList: any = [];

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private categoryService: CategoryService,
    private budgetService: BudgetService,
    private snackBar: MatSnackBar
  ) {
    this.screen = this.data.screen;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  editCategoryForm = new FormGroup({
    id: new FormControl(this.data.category.id, Validators.required),
    category: new FormControl(this.data.category.category, Validators.required),
    umbrella: new FormControl(this.data.category.umbrella, Validators.required),
  });

  addCategoryForm = new FormGroup({
    category: new FormControl('', Validators.required),
    umbrella: new FormControl('', Validators.required),
  });

  editBudgetForm = new FormGroup({
    id: new FormControl(this.data.category.id, Validators.required),
    category: new FormControl(this.data.category.category, Validators.required),
    price: new FormControl(this.data.category.price, Validators.required),
    date: new FormControl(this.data.category.date, Validators.required),
  });

  editBudget() {
    console.log(this.editBudgetForm.value);
    this.budgetService.saveBudget(this.editBudgetForm.value) .subscribe((data) => {
      this.dialogRef.close(true);
    });
}

  addCategory() {
    this.categoryService.saveCategory(this.addCategoryForm.value).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        console.log(error);
        this.onCancel();
      }
    );
  }

  openSnackBar() {
    this.snackBar.openFromComponent(DialogComponent, {
      duration: 1500,
    });
  }

  updateCategory() {
    this.categoryService
      .updateCategory(this.editCategoryForm.value)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }

  deleteCategory() {
    this.categoryService
      .deleteCategory(this.data.category.id)
      .subscribe((data) => {
        this.dialogRef.close(true);
      });
  }
}
