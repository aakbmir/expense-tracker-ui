import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  screen: any;
  feature: any;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private categoryService: CategoryService
  ) {
    console.log(this.data);
    this.screen = this.data.screen;
    this.feature = this.data.feature;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  categoryForm = new FormGroup({
    id: new FormControl(this.data.category.id, Validators.required),
    categoryName: new FormControl(
      this.data.category.categoryName,
      Validators.required
    ),
    budget: new FormControl(this.data.category.budget, Validators.required),
  });

  updateCategory() {
    console.log(this.categoryForm.value);
  }
}
