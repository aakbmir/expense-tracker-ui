import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-savings-report',
  templateUrl: './savings-report.component.html',
  styleUrls: ['./savings-report.component.css'],
})
export class SavingsReportComponent {
  data = [];

  constructor(private reportsService: ReportService) {}

  ngOnInit(): void {
    this.fetchSavingsData();
  }

  fetchSavingsData() {
    this.reportsService.savingsReport().subscribe((data: any) => {
      for (let ove of data) {
        const obj = ove;
        obj['totalAmount'] = ove['totalAccount'] + ove['budgetAmount'];
        obj['totalAccountInr'] = ove['totalAccount'] * 22.6;
        obj['totalInvestInr'] = ove['totalInvest'] * 22.6;
        obj['budgetAmountInr'] = ove['budgetAmount'] * 22.6;
        obj['totalAmountInr'] = ove['totalAmount'] * 22.6;
        this.data.push(obj);
      }
    });
  }
}
