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
  monthlyView: any = {};
  overviewFlag = true;
  monthlyFlag = false;
  targetFlag = false;
  trendFlag = false;
  
  responseList : any = [];
  
  constructor(
    private reportService: ReportService,
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
    this.fetchOverviewCategory(this.month, this.year);
    this.overviewFlag = true;
  }

  showReport(value: string) {
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
    } else if (value === 'trend') {
      this.overviewFlag = false;
      this.monthlyFlag = false;
      this.targetFlag = false;
      this.trendFlag = true;
    }
  }

  applyFilters() {
    console.log('inside');
    if (this.overviewFlag) {
      console.log('overview');
      this.overview = [];
      this.fetchOverviewCategory(
        this.filterForm.controls.filterMonth.value,
        this.filterForm.controls.filterYear.value
      );
    } else if (this.monthlyFlag) {
      this.fetchMonthlyCategory(this.month, this.year);
      console.log('monthly');
    } else if (this.targetFlag) {
      console.log('target');
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
    this.reportService.monthlyCategory(month, year).subscribe((data) => {
      this.responseList = data;
    });
  }
}
