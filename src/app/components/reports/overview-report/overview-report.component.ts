import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-overview-report',
  templateUrl: './overview-report.component.html',
  styleUrls: ['./overview-report.component.css'],
})
export class OverviewReportComponent {
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();

  public chart: any;

  totalSavings: any = 0;
  totalExpense: any = 0;
  totalBudget: any = 0;

  constructor(
    private reportService: ReportService,
    private commonService: CommonService ) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
  }

  distinctCategories: any = [];
  distinctBudgets: any = [];
  distinctExpenses: any = [];

  ngOnInit(): void {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
    this.fetchOverviewReport(this.month, this.year);
  }

  fetchOverviewReport(month: any, year: any) {
    this.reportService.overviewReport(month, year).subscribe((data) => {
      for (let da of data) {
        this.totalSavings = this.totalSavings + da.deviate;
        this.totalExpense = this.totalExpense + da.expense;
        this.totalBudget = this.totalBudget + da.budget;
        this.distinctCategories.push(da.superCategory);
        this.distinctExpenses.push(da.expense);
        this.distinctBudgets.push(da.budget);
      }

      this.createBarChart(
        this.distinctCategories,
        this.distinctBudgets,
        this.distinctExpenses
      );
    });
  }

  

  createPieChart(labels: any, expense: any) {
    //this.chart.defaults.datasets.bar.maxBarThickness = 73;
    this.chart = new Chart('MyChart', {
      type: 'pie', //this denotes tha type of chart
      data: {
        labels: labels,
        datasets: [
          {
            data: expense,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          subtitle: {
            display: true,
          },
          title: {
            display: true,
            color: 'white',
          },
        },
      },
    });
  }

  createBarChart(labels: any, budget: any, expense: any) {
    //this.chart.defaults.datasets.bar.maxBarThickness = 73;
    
    this.chart = new Chart('MyChart', {
      type: 'bar', //this denotes tha type of chart
      data: {
        labels: labels,
        datasets: [
          {
            data: budget,
            backgroundColor: '#7C48DA',
            barPercentage: 1,
            borderRadius: 10,
            label: 'Budget',
          },
          {
            data: expense,
            backgroundColor: '#F6A09A',
            barPercentage: 1,
            borderRadius: 10,
            label: 'Expense',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        scales: {
          x: {
            //stacked: true,
            //beginAtZero: true,
            grid: {
              display: false,
            },
          },
          y: {
            //stacked: true,
            //beginAtZero: true,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            color: 'white',
          },
        },
      },
    });
  }
}
