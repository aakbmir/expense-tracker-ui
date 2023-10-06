import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-category-report',
  templateUrl: './category-report.component.html',
  styleUrls: ['./category-report.component.css'],
})
export class CategoryReportComponent {

  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  groupedData: any = {};

  expensesTotal = 0;

  categoryList = [];

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
    this.fetchCategoryReport(this.month, this.year);
  }

  fetchCategoryReport(month: any, year: any) {
    this.reportService.categoryReport(month, year).subscribe((data) => {
      this.categoryList = data;
      this.groupedData = this.groupDataByParent(data);
      for (let dd of data) {
        this.expensesTotal = this.expensesTotal + dd.expense;
      }
    });
  }

  groupDataByParent(data: any[]): any {
    const grouped = {};
    data.forEach((item) => {
      const parentCategory = item.parentCategory;
      const superCategory = item.superCategory;
      if (!grouped[parentCategory]) {
        grouped[parentCategory] = {};
      }
      if (!grouped[parentCategory][superCategory]) {
        grouped[parentCategory][superCategory] = [];
      }
      grouped[parentCategory][superCategory].push(item);
    });
    return grouped;
  }

  groupedDataKeys() {
    return Object.keys(this.groupedData);
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
