import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BankService } from 'src/app/services/bank.service';
@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent  implements OnInit {

  filterOn = false;
  loading = false;
  count = 0;
  total: number = 0;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  constructor(
    private bankService: BankService,
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
    this.fetchAllBankRecords(this.month, this.year);
  }

  openDialog(bankRecord: any, screen: string, height: number, width: number) {
    console.log('bank : ', bankRecord);
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width - 3 + 'vw',
      position: { top: '0px' },
      data: {
        item: bankRecord,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllBankRecords(this.month, this.year);
      }
    });
  }

  fetchAllBankRecords(month: any, year: any) {
    this.bankService
      .getCurrentBankRecord(month, year)
      .subscribe((data: any) => {
        console.log('data', JSON.stringify(data));
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
  }

  groupedData: { [key: string]: any[] } = {};
  groupedDataArray: { date: string; items: any[] }[] = [];

  groupDataByDate(data: any) {
    this.groupedData = data.reduce((grouped, item) => {
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

  applyFilters() {
    this.fetchAllBankRecords(
      this.filterForm.controls.filterMonth.value,
      this.filterForm.controls.filterYear.value
    );
  }
}
