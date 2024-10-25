import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BudgetService } from 'src/app/services/budget.service';
import { CommonService } from 'src/app/services/common.service';

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
  resData: any = [];

  
  monthText = '';
  month = this.commonService.getCurrentMonth();
  year = this.commonService.getCurrentYear();

  constructor(private budgetService: BudgetService, private dialog: MatDialog, private commonService: CommonService) {
    this.month = this.commonService.getCurrentMonth();
    this.year = this.commonService.getCurrentYear();
  }

  ngOnInit(): void {
    this.month = this.commonService.getCurrentMonth();
    this.year = this.commonService.getCurrentYear();
    this.loading = true;
    this.fetchAllBudgetList(this.month, this.year);
  }

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
      this.resData = data;
      this.groupedData = this.groupDataByParent(data);

      for (let bud of data) {
        if (bud.price != null && bud.price !== '') {
          this.total = this.total + Number(bud.price);
        }
      }
      this.monthText = this.commonService.getCurrentMonthString(this.month);

    });
  }

  applyFilters(clickedBtn) {
    let calcMnth = Number(this.month) - 1;
    let calcYear = Number(this.year);
    if (clickedBtn === 'left') {
       calcMnth = Number(this.month) - 1;
      calcYear = Number(this.year);
      if (calcMnth == 0) {
        calcMnth = 12;
        calcYear =calcYear -1;
      }
    } else {
      calcMnth = Number(this.month) + 1;
      calcYear = Number(this.year);
      if (calcMnth == 13) {
        calcMnth = 1;
        calcYear = calcYear +1;
      }
    }

    console.log(calcMnth + " : " + calcYear);
    this.month = calcMnth;
    this.year = calcYear;

    this.fetchAllBudgetList(this.month, this.year);
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
