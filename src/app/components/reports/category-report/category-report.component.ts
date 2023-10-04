import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-category-report',
  templateUrl: './category-report.component.html',
  styleUrls: ['./category-report.component.css'],
})
export class CategoryReportComponent {
/*
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  groupedData: any = {};

  expensesTotal = 0;

  categoryList = [];

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
    this.fetchCategoryReport(this.month, this.year);
  }

  fetchCategoryReport(month: any, year: any) {
    this.reportService.categoryReport(month, year).subscribe((data) => {
      this.categoryList = data;
      this.groupedData = this.groupDataByParent(data);
      for (let dd of data) {
        this.expensesTotal = this.expensesTotal + dd.expense;
      }
    });
  }

  groupDataByParent(data: any[]): any {
    const grouped = {};
    data.forEach((item) => {
      const parentCategory = item.parentCategory;
      const superCategory = item.superCategory;
      if (!grouped[parentCategory]) {
        grouped[parentCategory] = {};
      }
      if (!grouped[parentCategory][superCategory]) {
        grouped[parentCategory][superCategory] = [];
      }
      grouped[parentCategory][superCategory].push(item);
    });
    return grouped;
  }

  groupedDataKeys() {
    return Object.keys(this.groupedData);
  }

  openDialog(category: any, screen: string, height: number, width: number) {
    let item = {
      parent: category,
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
  } */
  
  cumulativeReport: any = [];

  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();
  filterMonth: any;
  filterYear = 2023;


  totalExpense: any = 0;
  totalBudget: any = 0;
  totalDeviate: any = 0;

  constructor(private reportsService: ReportService, private commonService: CommonService) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.filterMonth = this.month;
  }

  ngOnInit(): void {
    
    this.fetchAllCategories(this.month, this.year);
  }

  fetchAllCategories(month, year) {
    this.reportsService.categoryReport(month, year).subscribe((data: any) => {
      console.log(data);
      this.cumulativeReport = data;

      for(let report of this.cumulativeReport) {
        console.log(report);
        this.totalExpense = this.totalExpense + report.expense;
        this.totalBudget = this.totalBudget + report.budget;
      }
      this.totalDeviate = this.totalBudget - this.totalExpense;
    });
  }

  applyFilters() {
    console.log(this.filterMonth, this.filterYear);
    this.fetchAllCategories(this.filterMonth, this.filterYear);
  }
}
