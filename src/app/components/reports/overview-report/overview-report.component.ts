import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { SavingsService } from 'src/app/services/savings.service';
import { ThemeService } from 'src/app/services/theme.service';
import {
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

  // View Controls
  activeSegment: 'actual' | 'summary' = 'actual';
  activeSubTab: 'expenses' | 'savings' = 'expenses';
  searchFlag: boolean = false;
  loading: boolean = false;
  expenseLoading: boolean = false;
  savingsLoading: boolean = false;
  currencySymbol: string = 'AED';

  // Date Navigation (defaults dynamically to current month and year)
  months = this.commonService.getMonths();
  years = this.commonService.getYears();
  month = this.commonService.getCurrentMonth();
  year = this.commonService.getCurrentYear();
  monthText: string = '';

  // KPI Metrics (Populated directly from API)
  totalIncome: number = 0;
  totalExpenseBudget: number = 0;
  totalExpenseSpent: number = 0;
  totalSavingsBudget: number = 0;
  totalSavingsDone: number = 0;

  get expenseBudgetPercent(): number {
    if (!this.totalExpenseBudget || this.totalExpenseBudget <= 0) return 0;
    return Math.min(100, Math.round((this.totalExpenseSpent / this.totalExpenseBudget) * 100));
  }

  get savingsBudgetPercent(): number {
    if (!this.totalSavingsBudget || this.totalSavingsBudget <= 0) return 0;
    return Math.min(100, Math.round((this.totalSavingsDone / this.totalSavingsBudget) * 100));
  }

  // Categories & Filtering
  selectedCategory = '';
  categoryList: string[] = [];
  subCategoryList: string[] = [];
  mainCategoryList: string[] = [];

  // Transaction Lists from API
  expensesList: OverviewTransaction[] = [];
  savingsList: OverviewTransaction[] = [];
  categoryBreakdownList: OverviewCategoryBreakdown[] = [];

  // Legacy flags for compatibility
  overviewFlag = true;
  groupFlag = false;
  bankFlag = false;
  trendFlag = false;

  constructor(
    private reportService: ReportService,
    private savingsService: SavingsService,
    private commonService: CommonService,
    private expenseService: ExpenseService,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.updateMonthString();
    this.fetchOverviewReport(this.month, this.year);
    this.fetchDistinctCategories();
  }

  updateMonthString(): void {
    this.monthText = this.commonService.getCurrentMonthString(this.month) || '';
  }

  fetchOverviewReport(month: any, year: any): void {
    this.loading = true;
    this.expenseLoading = true;
    this.totalIncome = 0;
    this.totalExpenseSpent = 0;
    this.totalExpenseBudget = 0;
    this.expensesList = [];
    this.categoryBreakdownList = [];
    this.updateMonthString();
    this.fetchOverviewData(this.month, this.year);
    this.fetchSavingsData(this.month, this.year);
    this.fetchAllExpenseList(this.month, this.year);
  }

  fetchAllExpenseList(month: any, year: any) {
    this.expenseLoading = true;
    this.expenseService.getCurrentExpense(month, year).subscribe({
      next: (data: any) => {
        if (data) {
          if (data && Array.isArray(data) && data.length > 0) {
            const items: OverviewTransaction[] = [];
            for (let s of data) {
              console.log('s', s);
              items.push({
                category: s.expenseName || s.categoryApiDTO?.category,
                description: s.description || '',
                amount: s.amount,
                date: s.savingsDate || s.date || new Date()
              });
            }
            this.expensesList = items;
          } else {
            // If savingsList is empty, calculate net savings from Income - Expense
            this.expensesList = [];
          }
        }
        this.expenseLoading = false;
      },
      error: () => {
        this.expenseLoading = false;
      }
    });
  }

  fetchOverviewData(month: any, year: any): void {
    this.reportService.overviewReport(month, year).subscribe({
      next: (data: any) => {
        this.totalIncome = data.totalIncome;
        this.totalExpenseBudget = data.totalExpenseBudget;
        this.totalExpenseSpent = data.totalExpenseSpent;
        this.totalSavingsBudget = data.totalSavingsBudget;
        this.totalSavingsDone = data.totalSavingsDone;

      },
      error: (err) => {
        console.error('Error loading overview report', err);
      }
    });
  }

  fetchSavingsData(month: any, year: any): void {
    this.savingsService.getCurrentSavings(month, year).subscribe({
      next: (data: any) => {
        if (data) {
          if (data.savingsList && Array.isArray(data.savingsList) && data.savingsList.length > 0) {
            const items: OverviewTransaction[] = [];
            for (let s of data.savingsList) {
              items.push({
                category: s.savingsName || s.categoryApiDTO?.category || 'Savings',
                description: s.description || '',
                amount: s.amount,
                date: s.savingsDate || s.date || new Date()
              });
            }
            this.savingsList = items;
          } else {
            // If savingsList is empty, calculate net savings from Income - Expense
            this.savingsList = [];
          }
        }
        this.savingsLoading = false;
      },
      error: () => {
        this.savingsLoading = false;
      }
    });
  }

  fetchDistinctCategories(): void {
    this.reportService.fetchAllCategoriesDetails().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.categoryList = [...new Set(data.map((item: any) => item.category).filter(Boolean))];
          this.subCategoryList = [...new Set(data.map((item: any) => item.subCategory).filter(Boolean))];
          this.mainCategoryList = [...new Set(data.map((item: any) => item.mainCategory).filter(Boolean))];
        }
      },
      error: () => { }
    });
  }

  // Month Navigation
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

  setActiveSegment(segment: 'actual' | 'summary'): void {
    this.activeSegment = segment;
  }

  setActiveSubTab(subTab: 'expenses' | 'savings'): void {
    this.activeSubTab = subTab;
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
}
