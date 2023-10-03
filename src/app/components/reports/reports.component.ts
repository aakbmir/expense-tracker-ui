import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  constructor(private router: Router) {}

  overviewFlag = true;
  parentFlag = false;
  superFlag = false;
  categoryFlag = false;
  trendFlag = false;
  searchFlag = false;

  ngOnInit() {
    this.overviewFlag = true;
  }

  showReport(value: string) {
    if (value === 'overview') {
      this.overviewFlag = true;
      this.parentFlag = false;
      this.superFlag = false;
      this.categoryFlag = false;
      this.trendFlag = false;
      this.router.navigateByUrl('/reports/overview');
    } else if (value === 'parent') {
      this.parentFlag = true;
      this.overviewFlag = false;
      this.superFlag = false;
      this.categoryFlag = false;
      this.trendFlag = false;
      this.router.navigateByUrl('/reports/parent');
    } else if (value === 'super') {
      this.overviewFlag = false;
      this.parentFlag = false;
      this.superFlag = true;
      this.categoryFlag = false;
      this.trendFlag = false;
      this.router.navigateByUrl('/reports/super-category');
    } else if (value === 'category') {
      this.overviewFlag = false;
      this.parentFlag = false;
      this.superFlag = false;
      this.categoryFlag = true;
      this.trendFlag = false;
      this.router.navigateByUrl('/reports/category');
    } else if (value === 'trend') {
      this.overviewFlag = false;
      this.parentFlag = false;
      this.superFlag = false;
      this.categoryFlag = false;
      this.trendFlag = true;
      this.router.navigateByUrl('/reports/trend');
    } else if (value === 'search') {
      this.overviewFlag = false;
      this.parentFlag = false;
      this.superFlag = false;
      this.categoryFlag = false;
      this.trendFlag = true;
      this.router.navigateByUrl('/reports/search');
    }
  }
}
