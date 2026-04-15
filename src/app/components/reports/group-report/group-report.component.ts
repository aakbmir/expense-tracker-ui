import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-group-report',
  templateUrl: './group-report.component.html',
  styleUrls: ['./group-report.component.css'],
})
export class GroupReportComponent {

  cumulativeReport: any = [];

  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();
  filterMonth: any;
  filterYear = 2024;
  monthText = '';

  totalExpense: any = 0;
  totalBudget: any = 0;
  totalDeviate: any = 0;
  loading: boolean = false;

  constructor(private reportsService: ReportService, private commonService: CommonService, private dialog: MatDialog,
    private router: Router, public themeService: ThemeService
  ) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.filterMonth = this.month;
  }

  ngOnInit(): void {
    this.fetchAllData(this.month, this.year);
  }

  fetchAllData(month, year) {
    this.monthText = this.commonService.getCurrentMonthStringShort(this.month);
    this.loading = true;
    this.reportsService.groupedReport(month, year).subscribe((data: any) => {
      this.cumulativeReport = data;
      for (let report of this.cumulativeReport) {
        report.expanded = false;
        this.totalExpense = this.totalExpense + report.expense;
        this.totalBudget = this.totalBudget + report.budget;
      }
      this.totalDeviate = this.totalBudget - this.totalExpense;
      this.loading = false;
    });
  }



  applyFilters(clickedBtn) {
    this.totalExpense = 0;
    let calcMnth = Number(this.month) - 1;
    let calcYear = Number(this.year);
    if (clickedBtn === 'left') {
      calcMnth = Number(this.month) - 1;
      calcYear = Number(this.year);
      if (calcMnth == 0) {
        calcMnth = 12;
        calcYear = calcYear - 1;
      }
    } else {
      calcMnth = Number(this.month) + 1;
      calcYear = Number(this.year);
      if (calcMnth == 13) {
        calcMnth = 1;
        calcYear = calcYear + 1;
      }
    }

    console.log(calcMnth + " : " + calcYear);
    this.month = calcMnth;
    this.year = calcYear;

    this.fetchAllData(this.month, this.year);
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

  openDialog(category: any, screen: string, height: number, width: number) {
    let item = {
      main: category,
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
  }
}
