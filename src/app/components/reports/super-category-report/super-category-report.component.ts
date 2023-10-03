import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-super-category-report',
  templateUrl: './super-category-report.component.html',
  styleUrls: ['./super-category-report.component.css'],
})
export class SuperCategoryReportComponent {
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  superCategoryList: any = [];
  expensesTotal = 0;

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
    this.fetchSuperCategoryReport(this.month, this.year);
  }

  fetchSuperCategoryReport(month: any, year: any) {
    this.reportService.superCategoryReport(month, year).subscribe((data) => {
      this.superCategoryList = data;

      for (let dd of data) {
        this.expensesTotal = this.expensesTotal + dd.expense;
      }
    });
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
  }
}
