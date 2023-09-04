import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ExpenseService } from 'src/app/services/expense.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})

export class ExpenseComponent implements OnInit {
  expenseList: any = [];
  loading = false;
  count = 0;
  total: number = 0;
  month = this.commonService.getCurrentMonth();
  year = this.commonService.getCurrentYear();
  
  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog, private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchAllExpenseList();
  }

  openDialog(expense: any, screen: string, height: number, width: number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      position: { top: '0px' },
      data: {
        item: expense,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllExpenseList();
      }
    });
  }

  fetchAllExpenseList() {
    this.expenseList = [];
    this.expenseService.getCurrentExpense(this.month, this.year).subscribe((data: any) => {
      this.expenseList = data;
      this.loading = false;
      this.count = this.expenseList.length > 0 ? this.expenseList.length : 0;
      this.total = 0;
      for(let bud of this.expenseList) {
        if(bud.price != null && bud.price !== '') {
          this.total = this.total +  Number(bud.price);
        }
      }
      console.log(this.count);
    });
  }
}