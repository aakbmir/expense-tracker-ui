import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { IncomeService } from 'src/app/services/income.service';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent implements OnInit {
  filterOn = false;
  loading = false;
  count = 0;
  total: number = 0;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();
  monthText = '';


  constructor(
    private incomeService: IncomeService,
    private dialog: MatDialog,
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
    this.loading = true;
    this.fetchAllIncomeList(this.month, this.year);
  }

  openDialog(income: any, screen: string, height: number, width: number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width - 3 + 'vw',
      position: { top: '0px' },
      data: {
        item: income,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllIncomeList(this.month, this.year);
      }
    });
  }

  fetchAllIncomeList(month: any, year: any) {
    console.log(month)
    this.incomeService
      .getCurrentIncome(month, year)
      .subscribe((data: any) => {
        this.groupDataByDate(data);
        this.loading = false;
        this.count = data.length > 0 ? data.length : 0;
        this.total = 0;
        for (let bud of data) {
          if (bud.price != null && bud.price !== '') {
            this.total = this.total + Number(bud.price);
          }
        }
      });
    this.monthText = this.commonService.getCurrentMonthString(month);
  }

  applyFilters(clickedBtn: string) {
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

    this.fetchAllIncomeList(this.month, this.year);
  }

  groupedData: { [key: string]: any[] } = {};
  groupedDataArray: { date: string; items: any[] }[] = [];
  expandedGroups: { [key: string]: boolean } = {};

  toggleGroup(date: string) {
    this.expandedGroups[date] = !this.isGroupExpanded(date);
  }

  isGroupExpanded(date: string) {
    return this.expandedGroups[date] === true;
  }

  expandAll() {
    for (let group of this.groupedDataArray) {
      this.expandedGroups[group.date] = true;
    }
  }

  collapseAll() {
    for (let group of this.groupedDataArray) {
      this.expandedGroups[group.date] = false;
    }
  }

  groupDataByDate(data: any) {
    this.groupedData = data.reduce((grouped: any, item: any) => {
      const date = item.date;

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(item);

      return grouped;
    }, {});
    this.groupedDataArray = Object.keys(this.groupedData).map((date) => ({
      date,
      items: this.groupedData[date],
    }));
  }

}
