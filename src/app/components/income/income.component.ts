import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IncomeService } from 'src/app/services/income.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent {
  incomes : any = [];
  isUpdate = false;
  loading = false;

constructor(
    private incomeService: IncomeService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {

    this.loading = true;
    this.incomeService.getAllIncome().subscribe((data: any) => {
      this.incomes = data;
      this.loading = false;
    });
  }

  modifyScreen(button: any) {
    if (button === 'edit') {
      this.isUpdate = true;
    } else if ((button = 'fill')) {
      this.isUpdate = false;
    }
  }

  openDialog(income: any, screen: string, feature: string, height: number, width:number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight:height+'vh',
      width:width+'vw',
      position: {top:'0px'},
      data : {
        income: income,
        screen: screen,
        feature: feature
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        // Make an API call and refresh the component
        this.fetchAllIncomes();
      }
    });
  }

  openDialogFilter(income: any, screen: string, feature: string, height: number, width:number) {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight:height+'vh',
      width:width+'vw',
      position: {top:'0px'},
      data : {
        income: income,
        screen: screen,
        feature: feature
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.incomes = [];
        this.incomes = result;
      }
    });
  }

  fetchAllIncomes() {
    this.incomes = [];
    this.incomeService.getAllIncome().subscribe((data: any) => {
      this.incomes = data;
      this.loading = false;
    });
  }
}

