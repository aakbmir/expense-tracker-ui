import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ThemeService } from 'src/app/services/theme.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  loading = false;
  total = 0;
  groupedData: any = {};
  expandedMains: Record<string, boolean> = {};
  expandedSubs: Record<string, Record<string, boolean>> = {};

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.fetchAllCategories();
  }

  openDialog(cat: any, screen: string, height: number, width: number) {
    let category = {};
    if (cat !== '') {
      if (screen == 'Category-Edit') {
        category = {
          category: cat.category,
          mainCategory: cat.mainCategory,
          subCategory: cat.subCategory,
          id: cat.id,
        };
      } else {
        category = {
          category: cat.category,
          id: cat.id,
        };
      }
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
        this.fetchAllCategories();
      }
    });
  }

  fetchAllCategories() {
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.loading = false;
      this.total = data.length;
      this.groupedData = this.groupDataByMain(data);
      this.initExpandedState();
    });
  }

  private initExpandedState() {
    const mains = Object.keys(this.groupedData || {});
    const nextMains: Record<string, boolean> = {};
    const nextSubs: Record<string, Record<string, boolean>> = {};

    mains.forEach((p, idx) => {
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

  groupDataByMain(data: any[]): any {
    const grouped = {};
    data.forEach((item) => {
      const mainCategory = item.mainCategory;
      const subCategory = item.subCategory;

      let cat = {
        mainCategory: item.mainCategory,
        subCategory: item.subCategory,
        category: item.category,
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
}
