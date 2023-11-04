import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-overview-report',
  templateUrl: './overview-report.component.html',
  styleUrls: ['./overview-report.component.css'],
})
export class OverviewReportComponent {
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();
  filterMonth: any;
  filterYear = 2023;

  totalSavings: any = 0;
  totalExpense: any = 0;
  totalBudget: any = 0;

  selectedCategory = '';
  categoryList: any = [];
  categoryTransactionList: any = [];

  superCategoryList: any = [];
  parentCategoryList: any = [];

  constructor(
    private reportService: ReportService,
    private commonService: CommonService
  ) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.filterMonth = this.month;
    console.log(this.filterMonth);
  }

  ngOnInit(): void {
    this.fetchOverviewReport(this.month, this.year);
    this.fetchDistinctCategories();
    this.fetchTransactions('Category');
  }

  fetchOverviewReport(month: any, year: any) {
    this.totalSavings = 0;
    this.totalBudget = 0;
    this.totalExpense = 0;
    this.reportService.overviewReport(month, year).subscribe((data) => {
      for (let da of data) {
        this.totalSavings = this.totalSavings + da.deviate;
        this.totalExpense = this.totalExpense + da.expense;
        this.totalBudget = this.totalBudget + da.budget;
      }
    });
  }

  fetchTransactions(clickedButton: any) {
    this.reportService
      .fetchTransactionForCategory(this.selectedCategory, clickedButton)
      .subscribe((data) => {
        this.categoryTransactionList = data;
        console.log(this.categoryTransactionList);
      });
  }

  fetchDistinctCategories() {
    this.reportService.fetchAllCategoriesDetails().subscribe(
      (data: any) => {
        this.categoryList = [...new Set(data.map((item) => item.category))];
        console.log(this.categoryList);
        this.superCategoryList = [
          ...new Set(data.map((item) => item.superCategory)),
        ];
        this.parentCategoryList = [
          ...new Set(data.map((item) => item.parentCategory)),
        ];
      },
      (error) => {}
    );
  }

  applyFilters() {
    console.log(this.filterMonth, this.filterYear);
    this.fetchOverviewReport(this.filterMonth, this.filterYear);
  }
}
