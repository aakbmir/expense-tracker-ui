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
  supcatDiv = true;
  groupedData: any = {};

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
    });
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
