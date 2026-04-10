import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BudgetService } from 'src/app/services/budget.service';
import { CommonService } from 'src/app/services/common.service';
import { ThemeService } from 'src/app/services/theme.service';

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

  groupedData: any = {};
  resData: any = [];
  expandedMains: Record<string, boolean> = {};
  expandedSubs: Record<string, Record<string, boolean>> = {};


  monthText = '';
  month = this.commonService.getCurrentMonth();
  year = this.commonService.getCurrentYear();

  constructor(private budgetService: BudgetService,
    private dialog: MatDialog,
    private commonService: CommonService,
    public themeService: ThemeService) {
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
        mainCategory: cat.mainCategory,
        subCategory: cat.subCategory,
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
      this.groupedData = this.groupDataByMain(data);
      this.initExpandedState();

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

    this.fetchAllBudgetList(this.month, this.year);
  }

  groupDataByMain(data: any[]): any {
    const grouped = {};
    data.forEach((item) => {
      const mainCategory = item.mainCategory;
      const subCategory = item.subCategory;

      let cat = {
        category: item.category,
        mainCategory: mainCategory,
        subCategory: subCategory,
        price: item.price,
        date: item.date,
        id: item.id,
      };
      if (!grouped[mainCategory]) {
        grouped[mainCategory] = {};
      }
      if (!grouped[mainCategory][subCategory]) {
        grouped[mainCategory][subCategory] = [];
      }
      grouped[mainCategory][subCategory].push(cat);
    });
    return grouped;
  }

  groupedDataKeys() {
    return Object.keys(this.groupedData);
  }

  private initExpandedState() {
    const mains = Object.keys(this.groupedData || {});
    const nextMains: Record<string, boolean> = {};
    const nextSubs: Record<string, Record<string, boolean>> = {};

    mains.forEach((p) => {
      nextMains[p] = false;
      const subs = Object.keys(this.groupedData[p] || {});
      nextSubs[p] = {};
      subs.forEach((s) => {
        nextSubs[p][s] = false;
      });
    });

    this.expandedMains = nextMains;
    this.expandedSubs = nextSubs;
  }

  toggleMain(main: string) {
    this.expandedMains[main] = !this.isMainExpanded(main);
  }

  isMainExpanded(main: string) {
    return this.expandedMains[main] ?? false;
  }

  toggleSub(main: string, sub: string) {
    if (!this.expandedSubs[main]) this.expandedSubs[main] = {};
    this.expandedSubs[main][sub] = !this.isSubExpanded(main, sub);
  }

  isSubExpanded(main: string, sub: string) {
    return this.expandedSubs[main]?.[sub] ?? false;
  }

  expandAll() {
    this.setAllExpandedState(true);
  }

  collapseAll() {
    this.setAllExpandedState(false);
  }

  private setAllExpandedState(state: boolean) {
    const mains = Object.keys(this.groupedData || {});
    mains.forEach((p) => {
      this.expandedMains[p] = state;
      if (!this.expandedSubs[p]) this.expandedSubs[p] = {};
      const subs = Object.keys(this.groupedData[p] || {});
      subs.forEach((s) => {
        this.expandedSubs[p][s] = state;
      });
    });
  }

  mainCount(main: string) {
    const subs = this.groupedData?.[main] || {};
    return Object.values(subs).reduce((acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
  }

  mainTotal(main: string): number {
    const subs = this.groupedData?.[main] || {};
    let total = 0;
    Object.values(subs).forEach((arr: any) => {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          total += Number(item.price || 0);
        });
      }
    });
    return total;
  }

  subTotal(main: string, sub: string): number {
    const items = this.groupedData?.[main]?.[sub] || [];
    let total = 0;
    items.forEach((item: any) => {
      total += Number(item.price || 0);
    });
    return total;
  }

  addAllBudget() {
    this.budgetService.addAllBudgets().subscribe((data: any) => {
      this.fetchAllBudgetList(this.month, this.year);
    });
  }
}
