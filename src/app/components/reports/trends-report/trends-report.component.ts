import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';

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

  constructor(
    private reportService: ReportService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTrendsReport();
  }

  fetchTrendsReport() {
    this.reportService.trendsReport().subscribe((data: any) => {
      for (let ove of data) {
        const obj = ove;
        obj['totalSalary'] = this.commonService.getBudget();
        //obj['totalBudget'] = this.commonService.getBudget();
        obj['savings'] = obj['totalSalary'] - obj['totalExpense'];
        obj['deviate'] = obj['totalBudget'] - obj['totalExpense'];
        this.responseList.push(obj);
      }
    });
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
