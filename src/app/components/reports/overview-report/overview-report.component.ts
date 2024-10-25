import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';

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
  filterYear = 2024;

  monthText = '';
  totalSavings: any = 0;
  totalExpense: any = 0;
  totalBudget: any = 0;

  selectedCategory = '';
  categoryList: any = [];
  categoryTransactionList: any = [];

  superCategoryList: any = [];
  parentCategoryList: any = [];

  constructor(private reportService: ReportService, private commonService: CommonService, private router: Router) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.filterMonth = this.month;
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
    this.monthText = this.commonService.getCurrentMonthStringShort(this.month);
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
      });
  }

  fetchDistinctCategories() {
    this.reportService.fetchAllCategoriesDetails().subscribe(
      (data: any) => {
        this.categoryList = [...new Set(data.map((item) => item.category))];
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

    this.fetchOverviewReport(this.month, this.year);
  }

  
  overviewFlag = true;
  groupFlag = false;
  bankFlag = false;
  trendFlag = false;
  searchFlag = false;

  showReport(value: string) {
    if (value === 'home') {
      this.router.navigateByUrl('/home');
    }
    if (value === 'overview') {
      this.overviewFlag = true;
      this.groupFlag = false;
      this.bankFlag = false;
      this.trendFlag = false;
      this.searchFlag = false;
      this.router.navigateByUrl('/reports/overview');
    } else if (value === 'group') {
      this.overviewFlag = false;
      this.groupFlag = true;
      this.bankFlag = false;
      this.trendFlag = false;
      this.searchFlag = false;
      this.router.navigateByUrl('/reports/group');
    } else if (value === 'bank') {
      this.overviewFlag = false;
      this.groupFlag = false;
      this.bankFlag = true;
      this.trendFlag = false;
      this.searchFlag = false;
      this.router.navigateByUrl('/reports/bank');
    } else if (value === 'trend') {
      this.overviewFlag = false;
      this.groupFlag = false;
      this.bankFlag = false;
      this.trendFlag = true;
      this.searchFlag = false;
      this.router.navigateByUrl('/reports/trend');
    } else if (value === 'search') {
      this.overviewFlag = false;
      this.groupFlag = false;
      this.bankFlag = false;
      this.trendFlag = false;
      this.searchFlag = true;
      this.router.navigateByUrl('/reports/search');
    }
  }

}
