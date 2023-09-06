import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ExpenseService } from 'src/app/services/expense.service';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  filterOn = false;
  expenseList: any = [];
  loading = false;
  count = 0;
  total: number = 0;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog,
    private commonService: CommonService
  ) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
  }

  filterForm = new FormGroup({
    filterMonth: new FormControl(this.month),
    filterYear: new FormControl(this.year),
  });

  ngOnInit(): void {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.loading = true;
    this.fetchAllExpenseList(this.month, this.year);
  }

  openDialog(expense: any, screen: string, height: number, width: number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      position: { top: '0px' },
      data: {
        item: expense,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllExpenseList(this.month, this.year);
      }
    });
  }

  fetchAllExpenseList(month: any, year: any) {
    this.expenseList = [];
    this.expenseService
      .getCurrentExpense(month, year)
      .subscribe((data: any) => {
        this.expenseList = data;
        this.loading = false;
        this.count = this.expenseList.length > 0 ? this.expenseList.length : 0;
        this.total = 0;
        for (let bud of this.expenseList) {
          if (bud.price != null && bud.price !== '') {
            this.total = this.total + Number(bud.price);
          }
        }
      });
  }

  applyFilters() {
    this.fetchAllExpenseList(
      this.filterForm.controls.filterMonth.value,
      this.filterForm.controls.filterYear.value
    );
  }
}
