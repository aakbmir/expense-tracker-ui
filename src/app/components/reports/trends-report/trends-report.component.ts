import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-trends-report',
  templateUrl: './trends-report.component.html',
  styleUrls: ['./trends-report.component.css'],
})
export class TrendReportComponent {
  filterOn = false;
  trendFlag = true;
  responseList: any = [];

  filterForm: any;
  totalSavings: number = 0;
  loading: boolean = false;

  totalIncome: number = 0;
  totalExpense: number = 0;
  savingsRate: number = 0;

  averageSavings: number = 0;
  averageIncome: number = 0;
  averageExpense: number = 0;
  maxChartValue: number = 1;

  constructor(
    private reportService: ReportService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.fetchTrendsReport();
  }

  fetchTrendsReport() {
    this.loading = true;
    this.reportService.trendsReport().subscribe((data: any) => {
      this.responseList = [];
      let sumSavings = 0;
      let sumIncome = 0;
      let sumExpense = 0;
      let maxVal = 0;

      for (let ove of data) {
        const obj = ove;
        obj['income'] = obj['totalIncome'];
        obj['totalSalary'] = obj['totalIncome'];
        //obj['totalBudget'] = this.commonService.getBudget();
        obj['savings'] = obj['totalSalary'] - obj['totalExpense'];
        obj['deviate'] = obj['totalIncome'] - obj['totalExpense'];
        this.responseList.push(obj);

        sumSavings += obj['savings'];
        sumIncome += obj['income'];
        sumExpense += obj['totalExpense'];

        if (obj['income'] > maxVal) maxVal = obj['income'];
        if (obj['totalExpense'] > maxVal) maxVal = obj['totalExpense'];
        if (obj['savings'] > maxVal) maxVal = obj['savings'];
      }

      this.totalSavings = sumSavings;
      this.totalIncome = sumIncome;
      this.totalExpense = sumExpense;

      const count = this.responseList.length || 1;
      this.averageSavings = sumSavings / count;
      this.averageIncome = sumIncome / count;
      this.averageExpense = sumExpense / count;
      this.maxChartValue = maxVal > 0 ? maxVal * 1.1 : 1;
      this.savingsRate = this.totalIncome > 0 ? (this.totalSavings / this.totalIncome) * 100 : 0;

      this.loading = false;
    });
  }

  getChartHeight(value: number): string {
    if (!value || value < 0) return '0%';
    const percentage = (value / this.maxChartValue) * 100;
    return (percentage > 100 ? 100 : percentage) + '%';
  }

  getMomProgress(item: any, type: string): string {
    const total = (item.income || 0) + (item.totalExpense || 0) + Math.abs(item.savings || 0);
    if (total === 0) return '0%';

    let val = 0;
    if (type === 'income') val = item.income || 0;
    if (type === 'expense') val = item.totalExpense || 0;
    if (type === 'savings') val = Math.abs(item.savings || 0);

    return ((val / total) * 100) + '%';
  }

  overviewFlag = true;
  groupFlag = false;
  bankFlag = false;

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
