import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { IncomeService } from 'src/app/services/income.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent implements OnInit {
  filterOn = false;
  incomeList: any = [];
  isUpdate = false;
  loading = false;
  count = 0;
  total: number = 0;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

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

  modifyScreen(button: any) {
    if (button === 'edit') {
      this.isUpdate = true;
    } else if ((button = 'fill')) {
      this.isUpdate = false;
    }
  }

  openDialog(budget: any, screen: string, height: number, width: number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width-3 + 'vw',
      position: { top: '0px' },
      data: {
        item: budget,
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
    this.incomeList = [];
    this.incomeService.getCurrentIncome(month, year).subscribe((data: any) => {
      this.incomeList = data;
      this.loading = false;
      this.count = this.incomeList.length > 0 ? this.incomeList.length : 0;
      this.total = 0;
      for (let bud of this.incomeList) {
        if (bud.price != null && bud.price !== '') {
          this.total = this.total + Number(bud.price);
        }
      }
    });
  }

  applyFilters() {
    this.fetchAllIncomeList(
      this.filterForm.controls.filterMonth.value,
      this.filterForm.controls.filterYear.value
    );
  }
}
