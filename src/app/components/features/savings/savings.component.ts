import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { ThemeService } from 'src/app/services/theme.service';
import { SavingsService } from 'src/app/services/savings.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css']
})
export class SavingsComponent implements OnInit {
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
    private savingsService: SavingsService,
    private dialog: MatDialog,
    private commonService: CommonService,
    public themeService: ThemeService
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
    this.fetchAllSavingsList(this.month, this.year);
  }

  openDialog(savings: any, screen: string, height: number, width: number) {

    console.log('savings', savings);
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width - 3 + 'vw',
      position: { top: '0px' },
      data: {
        item: savings,
        screen: screen,
        month: this.month,
        year: this.year,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllSavingsList(this.month, this.year);
      }
    });
  }

  fetchAllSavingsList(month: any, year: any) {
    this.loading = true;
    this.count = 0;
    this.total = 0;
    this.groupedData = {};
    this.groupedDataArray = [];
    this.expandedGroups = {};

    this.savingsService.getCurrentSavings(month, year).subscribe((data: any) => {
      this.groupDataByDate(data);
      this.loading = false;
      this.count = data.length > 0 ? data.length : 0;
      this.total = 0;
      for (let bud of data) {
        if (bud.amount != null && bud.amount !== '') {
          this.total = this.total + Number(bud.amount);
        }
      }
    });
    this.monthText = this.commonService.getCurrentMonthString(month);
  }

  applyFilters(clickedBtn) {
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

    this.month = calcMnth;
    this.year = calcYear;

    this.fetchAllSavingsList(this.month, this.year);
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
    this.groupedData = data.reduce((grouped, item) => {
      const date = item.date; // Assuming 'date' is the property name for the date

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
