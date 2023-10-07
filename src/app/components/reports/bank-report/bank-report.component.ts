import { Component } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-bank-report',
  templateUrl: './bank-report.component.html',
  styleUrls: ['./bank-report.component.css'],
})
export class BankReportComponent {
  data = [];

  constructor(private reportsService: ReportService) {}

  ngOnInit(): void {
    this.fetchSavingsData();
  }

  fetchSavingsData() {
    this.reportsService.bankReport().subscribe((data: any) => {
      console.log(data);

      for (let ove of data) {
        const obj = ove;
        obj['totalAmount'] = ove['HDFC'] + ove['ENBD'] + ove['Mashreq'];
        obj['HDFCInr'] = ove['HDFC'] * 22.6;
        obj['ENBDInr'] = ove['ENBD'] * 22.6;
        obj['MashreqInr'] = ove['Mashreq'] * 22.6;
        obj['totalAmountInr'] = ove['totalAmount'] * 22.6;
        this.data.push(obj);
      }
    });
  }
}
