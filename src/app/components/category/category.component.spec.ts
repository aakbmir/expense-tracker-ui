import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CategoryService } from 'src/app/services/category.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  const mockFinancialTypes = [
    {
      financialType: 'EXPENSE',
      mainCategories: [
        {
          mainCategory: 'Living Costs',
          superCategories: [
            {
              superCategory: 'Food',
              categories: [
                {
                  categoryId: 1,
                  categoryName: 'Grocery',
                  status: 'ACTIVE',
                  budgetAmount: 1000,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            getAllCategories: () => of({ financialTypes: mockFinancialTypes }),
          },
        },
        { provide: MatDialog, useValue: {} },
        {
          provide: ThemeService,
          useValue: {
            isLightMode$: of(true),
            toggleTheme: () => {},
          },
        },
        {
          provide: CommonService,
          useValue: {
            getMonths: () => ['01', '02'],
            getCurrentMonth: () => '08',
            getYears: () => ['2026'],
            getCurrentYear: () => 2026,
            getCurrentMonthString: () => 'August',
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
  });

  it('should accept nested financialTypes payload and expose display data', () => {
    component.financialTypes = mockFinancialTypes;
    component.ngOnInit();

    expect(component.displayFinancialTypes.length).toBe(1);
    expect(component.displayFinancialTypes[0].financialType).toBe('EXPENSE');
    expect(component.displayFinancialTypes[0].mainCategories[0].mainCategory).toBe('Living Costs');
    expect(component.getCategoryCount(component.displayFinancialTypes[0])).toBe(1);
  });
});
