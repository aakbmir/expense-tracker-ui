import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  filterOn = false;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  year = this.commonService.getCurrentYear();
  overview: any = {};
  monthlyView: any = {};
  monthlyFlag = false;
  overviewFlag = false;
  targetFlag = false;
  trendFlag = false;
  constructor(
    private reportService: ReportService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // let data = {
    //   totalBudget: '17717',
    //   totalExpense: '17700',
    //   totalDeviation: '17',
    // };
    // this.overview = data;
    // this.overviewFlag = true;

    this.reportService.totalOverview(this.month, this.year).subscribe(data=> {
      this.overview = data;
      this.overviewFlag = true;
    })
  }

  searchReport() {
    this.filterOn = false;
  }

  showReport(value: string) {
    if (value === 'overview') {
      this.overviewFlag = true;
      this.monthlyFlag = false;
      this.targetFlag = false;
      this.trendFlag = false;
    } else if (value === 'monthly') {
      this.overviewFlag = false;
      this.monthlyFlag = true;
      this.targetFlag = false;
      this.trendFlag = false;
    } else if (value === 'target') {
      this.overviewFlag = false;
      this.monthlyFlag = false;
      this.targetFlag = true;
      this.trendFlag = false;
    } else if (value === 'trend') {
      this.overviewFlag = false;
      this.monthlyFlag = false;
      this.targetFlag = false;
      this.trendFlag = true;
    }
  }
}
