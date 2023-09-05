import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BudgetService } from 'src/app/services/budget.service';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit {
  filterOn = false;
  budgetList: any = [];
  loading = false;
  count = 0;
  total: number = 0;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private commonService: CommonService
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
    this.loading = true;
    this.fetchAllBudgetList(this.month, this.year);
  }

  filterForm = new FormGroup({
    filterMonth: new FormControl(this.month),
    filterYear: new FormControl(this.year),
  });

  openDialog(budget: any, screen: string, height: number, width: number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      position: { top: '0px' },
      data: {
        item: budget,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllBudgetList(this.month, this.year);
      }
    });
  }

  fetchAllBudgetList(month: any, year: any) {
    this.budgetList = [];
    this.budgetService.getCurrentBudget(month, year).subscribe((data: any) => {
      this.budgetList = data;
      this.loading = false;
      this.count = this.budgetList.length;
      this.total = 0;
      for (let bud of this.budgetList) {
        if (bud.price != null && bud.price !== '') {
          this.total = this.total + Number(bud.price);
        }
      }
    });
  }

  applyFilters() {
    this.fetchAllBudgetList(
      this.filterForm.controls.filterMonth.value,
      this.filterForm.controls.filterYear.value
    );
  }
}
