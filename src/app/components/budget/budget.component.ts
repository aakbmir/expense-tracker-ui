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

  groupedData: any = {};
  resData: any = [];
  expandedParents: Record<string, boolean> = {};
  expandedSubs: Record<string, Record<string, boolean>> = {};

  
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

  private initExpandedState() {
    const parents = Object.keys(this.groupedData || {});
    const nextParents: Record<string, boolean> = {};
    const nextSubs: Record<string, Record<string, boolean>> = {};

    parents.forEach((p) => {
      nextParents[p] = false;
      const subs = Object.keys(this.groupedData[p] || {});
      nextSubs[p] = {};
      subs.forEach((s) => {
        nextSubs[p][s] = false;
      });
    });

    this.expandedParents = nextParents;
    this.expandedSubs = nextSubs;
  }

  toggleParent(parent: string) {
    this.expandedParents[parent] = !this.isParentExpanded(parent);
  }

  isParentExpanded(parent: string) {
    return this.expandedParents[parent] ?? false;
  }

  toggleSub(parent: string, sub: string) {
    if (!this.expandedSubs[parent]) this.expandedSubs[parent] = {};
    this.expandedSubs[parent][sub] = !this.isSubExpanded(parent, sub);
  }

  isSubExpanded(parent: string, sub: string) {
    return this.expandedSubs[parent]?.[sub] ?? false;
  }

  expandAll() {
    this.setAllExpandedState(true);
  }

  collapseAll() {
    this.setAllExpandedState(false);
  }

  private setAllExpandedState(state: boolean) {
    const parents = Object.keys(this.groupedData || {});
    parents.forEach((p) => {
      this.expandedParents[p] = state;
      if (!this.expandedSubs[p]) this.expandedSubs[p] = {};
      const subs = Object.keys(this.groupedData[p] || {});
      subs.forEach((s) => {
        this.expandedSubs[p][s] = state;
      });
    });
  }

  parentCount(parent: string) {
    const subs = this.groupedData?.[parent] || {};
    return Object.values(subs).reduce((acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
  }

  parentTotal(parent: string): number {
    const subs = this.groupedData?.[parent] || {};
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

  subTotal(parent: string, sub: string): number {
    const items = this.groupedData?.[parent]?.[sub] || [];
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
