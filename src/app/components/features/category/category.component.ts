import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { ThemeService } from 'src/app/services/theme.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  @Input() financialTypes: any[] = [];

  loading = false;
  total = 0;
  groupedData: any = {};
  expandedMains: Record<string, boolean> = {};
  expandedSubs: Record<string, Record<string, boolean>> = {};

  categories: any[] = [];
  displayFinancialTypes: any[] = [];
  categoryDate = '';
  totalAmount = 0;
  showInactive = false;
  isAllExpanded = false;
  months = this.commonService.getMonths();
  month = this.commonService.getCurrentMonth();
  years = this.commonService.getYears();
  year = this.commonService.getCurrentYear();
  monthText = '';

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    public themeService: ThemeService,
    private commonService: CommonService
  ) {
    this.months = this.commonService.getMonths();
    this.month = this.commonService.getCurrentMonth();
    this.years = this.commonService.getYears();
    this.year = this.commonService.getCurrentYear();
  }

  ngOnInit(): void {
    this.loading = true;
    if (this.financialTypes && this.financialTypes.length) {
      this.setFinancialTypes(this.financialTypes);
      return;
    }
    this.fetchAllCategories(this.month, this.year);
  }

  @Input()
  set financialTypesInput(value: any[] | undefined) {
    this.financialTypes = value || [];
    this.setFinancialTypes(this.financialTypes);
  }

  openDialog(cat: any, screen: string, height: number, width: number) {
    let category = {};
    if (cat !== '') {
      if (screen == 'Category-Edit' || screen == 'Category-Delete') {

        console.log('cattt', cat);
        category = {
          financialType: cat.financialType.financialType,
          categoryGroup: cat.categoryGroup,
          mainCategory: cat.mainCategory,
          superCategory: cat.superCategory,
          category: cat.category,
          categoryId: cat.categoryId,
          budgetAmount: cat.budgetAmount,
          date: cat.date,
          status: cat.status,
        };
      }
    }
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-modalbox',
      maxHeight: height + 'vh',
      width: width + 'vw',
      maxWidth: width - 3 + 'vw',
      position: { top: '0px' },
      data: {
        item: category,
        screen: screen,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchAllCategories(this.month, this.year, cat?.active ?? this.showInactive);
      }
    });
  }

  fetchAllCategories(month: any, year: any, showInactive: boolean = false) {
    this.loading = true;
    this.total = 0;
    this.groupedData = {};
    this.monthText = this.commonService.getCurrentMonthString(month);
    this.categoryService.getAllCategories(month, year, showInactive, "Category").subscribe((data: any) => {
      this.loading = false;
      this.categoryDate = data?.date || '';
      this.setFinancialTypes(data?.financialTypes || []);
    });
  }

  setFinancialTypes(data: any[] = []) {
    this.categories = data || [];
    this.displayFinancialTypes = Array.isArray(data) ? data : [];
    this.total = this.getTotalCategoryCount(this.displayFinancialTypes);
    this.totalAmount = this.getTotalAmount(this.displayFinancialTypes);
    this.initExpandedState();
    this.loading = false;
  }

  private getTotalCategoryCount(financialTypes: any[] = []): number {
    return financialTypes.reduce((total, financialType) => {
      const mainCategories = financialType?.mainCategories || [];
      return (
        total +
        mainCategories.reduce((mainTotal: number, mainCategory: any) => {
          const superCategories = mainCategory?.superCategories || [];
          return (
            mainTotal +
            superCategories.reduce((superTotal: number, superCategory: any) => {
              return superTotal + (superCategory?.categories || []).length;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  }

  private getTotalAmount(financialTypes: any[] = []): number {
    return financialTypes.reduce((total, financialType) => {
      const mainCategories = financialType?.mainCategories || [];
      return (
        total +
        mainCategories.reduce((mainTotal: number, mainCategory: any) => {
          const superCategories = mainCategory?.superCategories || [];
          return (
            mainTotal +
            superCategories.reduce((superTotal: number, superCategory: any) => {
              const categories = superCategory?.categories || [];
              return superTotal + categories.reduce((cTotal: number, cat: any) => cTotal + (cat?.budgetAmount || 0), 0);
            }, 0)
          );
        }, 0)
      );
    }, 0);
  }

  applyFilters(clickedBtn: any) {
    let calcMnth = Number(this.month) - 1;
    let calcYear = Number(this.year);
    if (clickedBtn === 'left') {
      calcMnth = Number(this.month) - 1;
      calcYear = Number(this.year);
      if (calcMnth == 0) {
        calcMnth = 12;
        calcYear = calcYear - 1;
      }
    } else {
      calcMnth = Number(this.month) + 1;
      calcYear = Number(this.year);
      if (calcMnth == 13) {
        calcMnth = 1;
        calcYear = calcYear + 1;
      }
    }
    this.month = calcMnth;
    this.year = calcYear;

    this.fetchAllCategories(this.month, this.year);
  }

  addAllCategory() {
    this.categoryService.addAllCategories(this.month, this.year).subscribe(() => {
      this.fetchAllCategories(this.month, this.year);
    });
  }

  private initExpandedState() {
    this.isAllExpanded = false;
    const nextMains: Record<string, boolean> = {};
    const nextSubs: Record<string, Record<string, boolean>> = {};

    this.displayFinancialTypes.forEach((financialType) => {
      const financialKey = `${financialType.financialType}`;
      nextMains[financialKey] = false;
      nextSubs[financialKey] = {};

      (financialType.mainCategories || []).forEach((mainCategory) => {
        const mainCategoryKey = `${financialType.financialType}-${mainCategory.mainCategory}`;
        nextMains[mainCategoryKey] = false;
        nextSubs[financialKey][mainCategoryKey] = false;
        nextSubs[mainCategoryKey] = {};

        (mainCategory.superCategories || []).forEach((superCategory) => {
          const superCategoryKey = `${financialType.financialType}-${mainCategory.mainCategory}-${superCategory.superCategory}`;
          nextSubs[mainCategoryKey][superCategoryKey] = false;
        });
      });
    });

    this.expandedMains = nextMains;
    this.expandedSubs = nextSubs;
  }

  toggleMain(key: string) {
    this.expandedMains[key] = !this.isMainExpanded(key);
  }

  isMainExpanded(key: string) {
    return this.expandedMains[key] ?? false;
  }

  toggleSub(mainKey: string, subKey: string) {
    if (!this.expandedSubs[mainKey]) this.expandedSubs[mainKey] = {};
    this.expandedSubs[mainKey][subKey] = !this.isSubExpanded(mainKey, subKey);
  }

  isSubExpanded(mainKey: string, subKey: string) {
    return this.expandedSubs[mainKey]?.[subKey] ?? false;
  }

  showInactiveRecords() {
    this.showInactive = !this.showInactive;
    this.fetchAllCategories(this.month, this.year, this.showInactive);
  }

  expandAll() {
    this.setAllExpandedState(true);
  }

  collapseAll() {
    this.setAllExpandedState(false);
  }

  toggleAllExpanded() {
    const shouldExpand = !this.isAnyExpanded();
    this.isAllExpanded = shouldExpand;
    this.setAllExpandedState(shouldExpand);
  }

  isAnyExpanded(): boolean {
    const mainExpanded = Object.keys(this.expandedMains).some(key => this.expandedMains[key] === true);
    if (mainExpanded) return true;

    return Object.values(this.expandedSubs).some(subMap =>
      Object.values(subMap).some(val => val === true)
    );
  }

  private setAllExpandedState(state: boolean) {
    this.isAllExpanded = state;
    this.displayFinancialTypes.forEach((financialType) => {
      const financialKey = financialType.financialType;
      this.expandedMains[financialKey] = state;
      if (!this.expandedSubs[financialKey]) this.expandedSubs[financialKey] = {};

      (financialType.mainCategories || []).forEach((mainCategory) => {
        const mainKey = `${financialType.financialType}-${mainCategory.mainCategory}`;
        this.expandedMains[mainKey] = state;
        this.expandedSubs[financialKey][mainKey] = state;

        if (!this.expandedSubs[mainKey]) this.expandedSubs[mainKey] = {};
        (mainCategory.superCategories || []).forEach((superCategory) => {
          const subKey = `${financialType.financialType}-${mainCategory.mainCategory}-${superCategory.superCategory}`;
          this.expandedSubs[mainKey][subKey] = state;
        });
      });
    });
  }

  getMainCategoryKey(financialType: any, mainCategory: any) {
    return `${financialType.financialType}-${mainCategory.mainCategory}`;
  }

  getSuperCategoryKey(financialType: any, mainCategory: any, superCategory: any) {
    return `${financialType.financialType}-${mainCategory.mainCategory}-${superCategory.superCategory}`;
  }

  getCategoryCount(financialType: any) {
    return (financialType?.mainCategories || []).reduce((total: number, mainCategory: any) => {
      return total + (mainCategory?.superCategories || []).reduce((subTotal: number, superCategory: any) => {
        return subTotal + (superCategory?.categories || []).length;
      }, 0);
    }, 0);
  }

  getMainCategoryCount(mainCategory: any) {
    return (mainCategory?.superCategories || []).reduce((total: number, superCategory: any) => {
      return total + (superCategory?.categories || []).length;
    }, 0);
  }

  getFlatCategory(financialType: any, mainCategory: any, superCategory: any, categoryObj: any) {
    return {
      financialType: financialType,
      categoryGroup: categoryObj.categoryGroup,
      mainCategory: mainCategory.mainCategory,
      superCategory: superCategory.superCategory,
      category: categoryObj.categoryName,
      categoryId: categoryObj.categoryId,
      budgetAmount: categoryObj.budgetAmount,
      date: this.categoryDate,
      status: categoryObj.status
    };
  }

  isSuperCategoryActive(superCategory: any): boolean {
    return (superCategory?.categories || []).some((c: any) => c.status === 'ACTIVE');
  }

  getFinancialTypeTotal(financialType: any): number {
    return (financialType?.mainCategories || []).reduce((total: number, mainCategory: any) => {
      return total + this.getMainCategoryTotal(mainCategory);
    }, 0);
  }

  getMainCategoryTotal(mainCategory: any): number {
    return (mainCategory?.superCategories || []).reduce((total: number, superCategory: any) => {
      const categories = superCategory?.categories || [];
      return total + categories.reduce((cTotal: number, cat: any) => cTotal + (cat?.budgetAmount || 0), 0);
    }, 0);
  }

  groupDataByMain(data: any[]): any {
    const grouped: Record<string, any> = {};
    data.forEach((item) => {
      const mainCategory = item.mainCategory;
      const subCategory = item.subCategory;

      const cat = {
        categoryId: item.categoryId,
        categoryGroup: item.categoryGroup,
        mainCategory: item.mainCategory,
        subCategory: item.subCategory,
        category: item.category,
        active: item.active,
        date: item.date,
      };

      if (!grouped[mainCategory]) {
        grouped[mainCategory] = {};
      }

      if (!grouped[mainCategory][subCategory]) {
        grouped[mainCategory][subCategory] = [];
      }

      grouped[mainCategory][subCategory].push(cat);
    });
    return grouped;
  }

  groupedDataKeys() {
    return Object.keys(this.groupedData).sort((a, b) => a.localeCompare(b));
  }
}
