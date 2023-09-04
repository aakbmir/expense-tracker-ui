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
  budgetList: any = [];
  loading = false;
  count = 0;
  total: number = 0;
  month = this.commonService.getCurrentMonth();
  year = this.commonService.getCurrentYear();
  
  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog, private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchAllBudgetList();
  }

  openDialog(budget: any, screen: string, height: number, width: number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      position: { top: '0px' },
      data: {
        item: budget,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllBudgetList();
      }
    });
  }

  fetchAllBudgetList() {
    this.budgetList = [];
    this.budgetService.getCurrentBudget(this.month, this.year).subscribe((data: any) => {
      this.budgetList = data;
      this.loading = false;
      this.count = this.budgetList.length;
      this.total = 0;
      for(let bud of this.budgetList) {
        if(bud.price != null && bud.price !== '') {
          this.total = this.total +  Number(bud.price);
        }
      }
    });
  }
}
