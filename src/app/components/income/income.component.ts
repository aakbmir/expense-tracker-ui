import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
    incomeList: any = [];
    isUpdate = false;
    loading = false;
    count = 0;
    total: number = 0;
    month = this.commonService.getCurrentMonth();
    year = this.commonService.getCurrentYear();
    
    constructor(
      private incomeService: IncomeService,
      private dialog: MatDialog, private commonService: CommonService
    ) {}
  
    ngOnInit(): void {
      this.loading = true;
      this.fetchAllIncomeList();
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
          item: budget,
          screen: screen,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.fetchAllIncomeList();
        }
      });
    }
  
    fetchAllIncomeList() {
      this.incomeList = [];
      this.incomeService.getCurrentIncome(this.month, this.year).subscribe((data: any) => {
        this.incomeList = data;
        this.loading = false;
        this.count = this.incomeList.length > 0 ? this.incomeList.length : 0;
        this.total = 0;
        for(let bud of this.incomeList) {
          if(bud.price != null && bud.price !== '') {
            this.total = this.total +  Number(bud.price);
          }
        }
        console.log(this.count);
      });
    }
  }