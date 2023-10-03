import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-trends-report',
  templateUrl: './trends-report.component.html',
  styleUrls: ['./trends-report.component.css']
})
export class TrendReportComponent {

  filterOn = false;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  monthlyBudgetTotal = 0;
  monthlyExpenseTotal = 0;
  monthlyDeviateTotal = 0;

  trendsOverview: any = {};
  trendFlag = true;
  responseList: any = [];

  filterForm: any;
  constructor(
    private reportService: ReportService,
    private commonService: CommonService,
    private expenseService: ExpenseService,
    private dialog: MatDialog
  ) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
  }

  ngOnInit(): void {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.filterForm = new FormGroup({
      filterMonth: new FormControl(this.month),
      filterYear: new FormControl('2023'),
    });
    this.fetchTrendsOverview();
  }


  fetchTrendsOverview() {
    this.monthlyBudgetTotal = 0;
    this.monthlyExpenseTotal = 0;
    this.monthlyDeviateTotal = 0;
    this.trendsOverview = {};
    this.reportService.fetchTrendsOverview().subscribe((data: any) => {
      let totBudget = 0;
      let totExpense = 0;
      let totSavings = 0;
      for (let ove of data) {
        const obj = ove;
        obj['deviate'] = ove['totalBudget'] - ove['totalExpense'];
        totBudget = totBudget + ove['totalBudget'];
        totExpense = totExpense + ove['totalExpense'];
        totSavings = totSavings + obj['deviate'];
        this.responseList.push(obj);
      }
      this.trendsOverview = {
        totBudget: totBudget,
        totExpense: totExpense,
        totSavings: totSavings
      };
    });
  }

  openDialog(parent: any, screen: string, height: number, width: number) {
    let item = {
      parent: parent,
      month: this.month,
      year: this.year,
    };
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width - 3 + 'vw',
      position: { top: '10px' },
      data: {
        item: item,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
