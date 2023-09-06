import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  filterOn = false;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  overview: any = {};
  overviewFlag = false;

  monthlyFlag = false;
  monthlyBudgetTotal = 0;
  monthlyExpenseTotal = 0;
  monthlyDeviateTotal = 0;

  targetFlag = true;
  targetBudgetTotal = 0;
  targetExpenseTotal = 0;
  targetDeviateTotal = 0;
  
  trendFlag = false;

  responseList: any = [];

  filterForm: any; 
  constructor(
    private reportService: ReportService,
    private commonService: CommonService,
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
    console.log(this.month);
    console.log(this.year);
    this.filterForm = new FormGroup({
      filterMonth: new FormControl(this.month),
      filterYear: new FormControl('2023'),
    });
    this.fetchMonthlyParent(this.month, this.year);
    this.targetFlag = true;
  }

  showReport(value: string) {
    this.responseList = [];
    this.overview =[];
    if (value === 'overview') {
      this.overviewFlag = true;
      this.monthlyFlag = false;
      this.targetFlag = false;
      this.trendFlag = false;
      this.fetchOverviewCategory(this.month, this.year);
    } else if (value === 'monthly') {
      this.overviewFlag = false;
      this.monthlyFlag = true;
      this.targetFlag = false;
      this.trendFlag = false;
      this.fetchMonthlyCategory(this.month, this.year);
    } else if (value === 'target') {
      this.overviewFlag = false;
      this.monthlyFlag = false;
      this.targetFlag = true;
      this.trendFlag = false;
      this.fetchMonthlyParent(this.month, this.year);
    } else if (value === 'trend') {
      this.overviewFlag = false;
      this.monthlyFlag = false;
      this.targetFlag = false;
      this.trendFlag = true;
    }
  }

  applyFilters() {
    if (this.overviewFlag) {
      this.overview = [];
      this.fetchOverviewCategory(
        this.filterForm.controls.filterMonth.value,
        this.filterForm.controls.filterYear.value
      );
    } else if (this.monthlyFlag) {
      this.responseList = [];
      this.fetchMonthlyCategory(
        this.filterForm.controls.filterMonth.value,
        this.filterForm.controls.filterYear.value
      );
    } else if (this.targetFlag) {
      this.responseList = [];
      this.fetchMonthlyParent(
        this.filterForm.controls.filterMonth.value,
        this.filterForm.controls.filterYear.value
      );
    } else if (this.trendFlag) {
      console.log('trend');
    }
  }

  fetchOverviewCategory(month: any, year: any) {
    this.reportService.overviewCategory(month, year).subscribe((data) => {
      this.overview = data;
    });
  }

  fetchMonthlyCategory(month: any, year: any) {
    this.monthlyBudgetTotal = 0;
    this.monthlyExpenseTotal = 0;
    this.monthlyDeviateTotal = 0;
    this.reportService.monthlyCategory(month, year).subscribe((data) => {
      this.responseList = data;
      for (let ove of data) {
        this.monthlyBudgetTotal += ove.budget;
        this.monthlyExpenseTotal += ove.expense;
        this.monthlyDeviateTotal += ove.deviate;
      }
    });
  }

  fetchMonthlyParent(month: any, year: any) {
    this.targetBudgetTotal = 0;
    this.targetExpenseTotal = 0;
    this.targetDeviateTotal = 0;
    this.reportService.monthlyParent(month, year).subscribe((data) => {
      this.responseList = data;
      for (let ove of data) {
        this.targetBudgetTotal += ove.budget;
        this.targetExpenseTotal += ove.expense;
        this.targetDeviateTotal += ove.deviate;
      }
    });
  }
  
  openDialog(parent: any, screen: string, height: number, width: number) {
    let item = {
      "parent":parent,
      "month": this.month,
      "year": this.year
    }
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
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
