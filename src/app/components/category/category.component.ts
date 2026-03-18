import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  loading = false;
  total = 0;
  groupedData: any = {};
  expandedParents: Record<string, boolean> = {};
  expandedSubs: Record<string, Record<string, boolean>> = {};

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

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
          parentCategory: cat.parentCategory,
          superCategory: cat.superCategory,
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
      this.groupedData = this.groupDataByParent(data);
      this.initExpandedState();
    });
  }

  private initExpandedState() {
    const parents = Object.keys(this.groupedData || {});
    const nextParents: Record<string, boolean> = {};
    const nextSubs: Record<string, Record<string, boolean>> = {};

    parents.forEach((p, idx) => {
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

  groupDataByParent(data: any[]): any {
    const grouped = {};
    data.forEach((item) => {
      const parentCategory = item.parentCategory;
      const superCategory = item.superCategory;

      let cat = {
        parentCategory: item.parentCategory,
        superCategory: item.superCategory,
        category: item.category,
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
}
