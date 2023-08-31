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

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    let category1 = {
      id:1,
      categoryName:"hello",
      budget:"1000"
    }
    this.categories.push(category1);

    let category2 = {
      id:2,
      categoryName:"World",
      budget:"2000"
    }
    this.categories.push(category2);

    
    // this.categoryService.getAllCategories().subscribe((data: any) => {
    //   console.log(data);
    //   this.categories = data;
    // });
  }

  modifyScreen(button: any) {
    if (button === 'edit') {
      this.isUpdate = true;
    } else if ((button = 'fill')) {
      this.isUpdate = false;
    }
  }

  openDialog(category: any, screen: string, feature: string) {
    let dialogRef = this.dialog.open(DialogComponent, {
      height:'35%',
      width:'80%',
      data : {
        category: category,
        screen: screen,
        feature: feature
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
