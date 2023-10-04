import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-savings-report',
  templateUrl: './savings-report.component.html',
  styleUrls: ['./savings-report.component.css'],
})
export class SavingsReportComponent {

  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();
  filterMonth: any;
  filterYear = 2023;

  constructor(private commonService: CommonService) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.filterMonth = this.month;
  }

  applyFilters() {
    console.log(this.filterMonth, this.filterYear);
  }
}