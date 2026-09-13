import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { SavingsService } from 'src/app/services/savings.service';
import { ThemeService } from 'src/app/services/theme.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import {
  faCaretRight,
  faCircle,
  faPlane,
  faWallet,
  faBullseye,
  faPiggyBank,
  faCoins,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faReceipt,
  faChartBar,
  faChartLine,
  faChartPie,
  faUtensils,
  faHome,
  faCar,
  faBolt,
  faShoppingBag,
  faSlidersH,
  faPlus,
  faTags,
  faSun,
  faMoon,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { ExpenseService } from 'src/app/services/expense.service';
import { MatDialog } from '@angular/material/dialog';

export interface OverviewTransaction {
  category: string;
  description?: string;
  amount: number;
  date: string | Date;
  categoryApiDTO?: any;
  icon?: any;
  bg?: string;
  color?: string;
}

export interface OverviewCategoryBreakdown {
  category: string;
  amount: number;
  budgetAmount: number;
  percentage: number;
  icon?: any;
  bg?: string;
  color?: string;
}

@Component({
  selector: 'app-overview-report',
  templateUrl: './overview-report.component.html',
  styleUrls: ['./overview-report.component.css'],
})
export class OverviewReportComponent implements OnInit {
  // FontAwesome Icons
  faCaretRight = faCaretRight;
  faWallet = faWallet;
  faBullseye = faBullseye;
  faPiggyBank = faPiggyBank;
  faCoins = faCoins;
  faCalendarAlt = faCalendarAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faReceipt = faReceipt;
  faChartBar = faChartBar;
  faChartLine = faChartLine;
  faChartPie = faChartPie;
  faUtensils = faUtensils;
  faHome = faHome;
  faCar = faCar;
  faBolt = faBolt;
  faShoppingBag = faShoppingBag;
  faSlidersH = faSlidersH;
  faPlus = faPlus;
  faTags = faTags;
  faSun = faSun;
  faMoon = faMoon;
  faArrowRight = faArrowRight;
  faPlane = faPlane;
  faCircle = faCircle;
  // View Controls


  loading: boolean = false;
  currencySymbol: string = 'AED';

  // Date Navigation (defaults dynamically to current month and year)
  months = this.commonService.getMonths();
  years = this.commonService.getYears();
  month = this.commonService.getCurrentMonth();
  year = this.commonService.getCurrentYear();
  monthText: string = '';

  // KPI Metrics (Populated directly from API)
  totalIncome: number = 0;
  totalPlannedExpenses: number = 0;
  totalActualExpenses: number = 0;
  totalPlannedSavings: number = 0;
  totalActualSavings: number = 0;

  get expenseBudgetPercent(): number {
    if (!this.totalPlannedExpenses || this.totalPlannedExpenses <= 0) return 0;
    return Math.min(100, Math.round((this.totalActualExpenses / this.totalPlannedExpenses) * 100));
  }

  get savingsBudgetPercent(): number {
    if (!this.totalPlannedSavings || this.totalPlannedSavings <= 0) return 0;
    return Math.min(100, Math.round((this.totalActualSavings / this.totalPlannedSavings) * 100));
  }

  // Legacy flags for compatibility
  overviewFlag = true;
  groupFlag = false;
  trendFlag = false;

  cumulativeReport: any = [];

  constructor(
    private reportService: ReportService,
    private commonService: CommonService,
    private router: Router,
    public themeService: ThemeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.updateMonthString();
    this.fetchOverviewReport(this.month, this.year);
  }

  updateMonthString(): void {
    this.monthText = this.commonService.getCurrentMonthString(this.month) || '';
  }

  fetchOverviewReport(month: any, year: any): void {
    this.loading = true;
    this.totalIncome = 0;
    this.totalActualExpenses = 0;
    this.totalPlannedExpenses = 0;
    this.updateMonthString();
    this.fetchOverviewData(this.month, this.year);
    this.fetchAllData(this.month, this.year);
  }

  fetchAllData(month, year) {
    this.monthText = this.commonService.getCurrentMonthStringShort(this.month);
    this.loading = true;
    
    this.reportService.groupedReport(month, year).subscribe((data: any) => {
      this.cumulativeReport = data.parentCategoryDTOList;
      this.totalIncome = data.income.price;
      for (let report of this.cumulativeReport) {
        
        
        report.expanded = false;
        //this.totalExpense = this.totalExpense + report.expense;
      }
      //this.totalDeviate = this.totalIncome - this.totalExpense;
      this.loading = false;
    });
  }

  fetchOverviewData(month: any, year: any): void {
    this.reportService.overviewReport(month, year).subscribe({
      next: (data: any) => {
        this.totalIncome = data.totalIncome;
        this.totalPlannedExpenses = data.totalPlannedExpenses;
        this.totalActualExpenses = data.totalActualExpenses;
        this.totalPlannedSavings = data.totalPlannedSavings;
        this.totalActualSavings = data.totalActualSavings;

      },
      error: (err) => {
        console.error('Error loading overview report', err);
      }
    });
  }

  applyFilters(direction: 'left' | 'right'): void {
    let m = Number(this.month);
    let y = Number(this.year);

    if (direction === 'left') {
      m = m - 1;
      if (m === 0) {
        m = 12;
        y = y - 1;
      }
    } else {
      m = m + 1;
      if (m === 13) {
        m = 1;
        y = y + 1;
      }
    }

    this.month = m < 10 ? '0' + m : '' + m;
    this.year = y;
    this.fetchOverviewReport(this.month, this.year);
  }

  // Dynamic Category Icon & Pastel Color Mapping
  getCategoryStyle(categoryName: string): { icon: any; bg: string; color: string } {
    const name = (categoryName || '').toLowerCase();

    if (name.includes('food') || name.includes('dining') || name.includes('rest') || name.includes('eat') || name.includes('grocer')) {
      return { icon: this.faUtensils, bg: '#fee2e2', color: '#ef4444' };
    }
    if (name.includes('rent') || name.includes('home') || name.includes('house') || name.includes('mortgage') || name.includes('apart')) {
      return { icon: this.faHome, bg: '#dbeafe', color: '#3b82f6' };
    }
    if (name.includes('trans') || name.includes('car') || name.includes('fuel') || name.includes('gas') || name.includes('travel') || name.includes('taxi')) {
      return { icon: this.faCar, bg: '#ede9fe', color: '#8b5cf6' };
    }
    if (name.includes('util') || name.includes('power') || name.includes('elect') || name.includes('water') || name.includes('bill') || name.includes('light')) {
      return { icon: this.faBolt, bg: '#fef3c7', color: '#f59e0b' };
    }
    if (name.includes('shop') || name.includes('cloth') || name.includes('mall') || name.includes('store') || name.includes('buy')) {
      return { icon: this.faShoppingBag, bg: '#ccfbf1', color: '#14b8a6' };
    }
    if (name.includes('saving') || name.includes('invest') || name.includes('fund') || name.includes('bank')) {
      return { icon: this.faPiggyBank, bg: '#ecfdf5', color: '#10b981' };
    }

    return { icon: this.faTags, bg: '#f1f5f9', color: '#64748b' };
  }

  // Legacy method for compatibility
  showReport(value: string): void {
    if (value === 'home') this.router.navigateByUrl('/home');
    else if (value === 'overview') this.router.navigateByUrl('/reports/overview');
    else if (value === 'group') this.router.navigateByUrl('/reports/group');
    else if (value === 'bank') this.router.navigateByUrl('/reports/bank');
    else if (value === 'trend') this.router.navigateByUrl('/reports/trend');
    else if (value === 'search') this.router.navigateByUrl('/reports/search');
  }

  openDialog(category: any, screen: string, height: number, width: number) {
    let item = {
      main: category,
      month: this.month,
      year: this.year,
    };
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width - 3 + 'vw',
      position: { top: '10px' },
      data: {
        item: item,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }


  private categoryIcons: Record<string, IconDefinition> = {
    housing: faCar,
    transport: faCar,
    food: faUtensils,
    travel: faPlane
  };

  getCategoryIcon(name: string): IconDefinition {
    return this.categoryIcons[name.toLowerCase()] ?? faChevronRight;
  }
}
