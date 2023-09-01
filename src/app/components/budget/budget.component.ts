import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BudgetService } from 'src/app/services/budget.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit {
  budgetList: any = [];
  isUpdate = false;
  loading = false;
  count = 0;

  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchAllBudgetList();
  }

  modifyScreen(button: any) {
    if (button === 'edit') {
      this.isUpdate = true;
    } else if ((button = 'fill')) {
      this.isUpdate = false;
    }
  }

  openDialog(budget: any, screen: string, height: number, width: number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      position: { top: '0px' },
      data: {
        category: budget,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.fetchAllBudgetList();
      }
    });
  }

  fetchAllBudgetList() {
    this.budgetList = [];
    this.budgetService.getAllBudgets().subscribe((data: any) => {
      this.budgetList = data;
      this.loading = false;
      this.count = this.budgetList.length;
    });
  }
}
