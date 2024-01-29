import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { ReportService } from 'src/app/services/report.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-trends-report',
  templateUrl: './trends-report.component.html',
  styleUrls: ['./trends-report.component.css'],
})
export class TrendReportComponent {
  filterOn = false;
  trendFlag = true;
  responseList: any = [];

  filterForm: any;
  constructor(
    private reportService: ReportService,
    private commonService: CommonService,
    private dialog: MatDialog
  ) {  }

  ngOnInit(): void {
    this.fetchTrendsReport();
  }

  fetchTrendsReport() {
    this.reportService.trendsReport().subscribe((data: any) => {
      for (let ove of data) {
        const obj = ove;
        obj['totalBudget'] = this.commonService.getBudget();
        obj['deviate'] = obj['totalBudget'] - obj['totalExpense'];
        this.responseList.push(obj);
      }
    });
  }
}
