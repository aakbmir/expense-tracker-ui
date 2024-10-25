import { Component, OnInit } from '@angular/core';
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
  loading = false;
  count = 0;
  total: number = 0;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();
  monthText = '';


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
      maxWidth: width - 3 + 'vw',
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
    console.log(month)
    this.expenseService
      .getCurrentExpense(month, year)
      .subscribe((data: any) => {
        this.groupDataByDate(data);
        this.loading = false;
        this.count = data.length > 0 ? data.length : 0;
        this.total = 0;
        for (let bud of data) {
          if (bud.price != null && bud.price !== '') {
            this.total = this.total + Number(bud.price);
          }
        }
      });
      this.monthText = this.commonService.getCurrentMonthString(month);
  }

  applyFilters(clickedBtn) {
    let calcMnth = Number(this.month) - 1;
    let calcYear = Number(this.year);
    if (clickedBtn === 'left') {
       calcMnth = Number(this.month) - 1;
      calcYear = Number(this.year);
      if (calcMnth == 0) {
        calcMnth = 12;
        calcYear =calcYear -1;
      }
    } else {
      calcMnth = Number(this.month) + 1;
      calcYear = Number(this.year);
      if (calcMnth == 13) {
        calcMnth = 1;
        calcYear = calcYear +1;
      }
    }

    console.log(calcMnth + " : " + calcYear);
    this.month = calcMnth;
    this.year = calcYear;

    this.fetchAllExpenseList(this.month, this.year);
  }

  groupedData: { [key: string]: any[] } = {};
  groupedDataArray: { date: string; items: any[] }[] = [];

  groupDataByDate(data: any) {
    this.groupedData = data.reduce((grouped, item) => {
      const date = item.date; // Assuming 'date' is the property name for the date

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(item);

      return grouped;
    }, {});
    this.groupedDataArray = Object.keys(this.groupedData).map((date) => ({
      date,
      items: this.groupedData[date],
    }));
  }


}
