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
  categories: any = [];
  isUpdate = false;
  loading = false;
  total = 0;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.fetchAllCategories();
  }

  modifyScreen(button: any) {
    if (button === 'edit') {
      this.isUpdate = true;
    } else if ((button = 'fill')) {
      this.isUpdate = false;
    }
  }

  openDialog(category: any, screen: string, height: number, width:number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight:height+'vh',
      width:width+'vw',
      position: {top:'0px'},
      data : {
        item: category,
        screen: screen
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        // Make an API call and refresh the component
        this.fetchAllCategories();
      }
    });
  }

  fetchAllCategories() {
    this.categories = [];
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.categories = data;
      this.loading = false;
      this.total = this.categories.length;
    });
  }
}
