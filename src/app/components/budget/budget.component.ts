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
  loading = false;
  count = 0;
  total: number = 0;
  supcatDiv = true;

  groupedData: any = {};

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

  openDialog(cat: any, screen: string, height: number, width: number) {
    let category = {};
    if (cat !== '') {
      category = {
        category: cat.category,
        parentCategory: cat.parentCategory,
        superCategory: cat.superCategory,
        price: cat.price,
        date: cat.date,
        id: cat.id,
      };
    }

    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width - 3 + 'vw',
      position: { top: '0px' },
      data: {
        item: category,
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
    this.budgetService.getCurrentBudget(month, year).subscribe((data: any) => {
      this.loading = false;
      this.count = data.length;
      this.total = 0;
      this.groupedData = this.groupDataByParent(data);
      for (let bud of data) {
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

  groupDataByParent(data: any[]): any {
    const grouped = {};
    data.forEach((item) => {
      const parentCategory = item.parentCategory;
      const superCategory = item.superCategory;

      let cat = {
        category: item.category,
        parentCategory: parentCategory,
        superCategory: superCategory,
        price: item.price,
        date: item.date,
        id: item.id,
      };
      if (!grouped[parentCategory]) {
        grouped[parentCategory] = {};
      }
      if (!grouped[parentCategory][superCategory]) {
        grouped[parentCategory][superCategory] = [];
      }
      grouped[parentCategory][superCategory].push(cat);
    });
    return grouped;
  }

  groupedDataKeys() {
    return Object.keys(this.groupedData);
  }

  addAllBudget() {
    this.budgetService.addAllBudgets().subscribe((data: any) => {
      this.fetchAllBudgetList(this.month, this.year);
    });
  }
}
