import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperCategoryReportComponent } from './super-category-report.component';

describe('SuperCategoryReportComponent', () => {
  let component: SuperCategoryReportComponent;
  let fixture: ComponentFixture<SuperCategoryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperCategoryReportComponent],
    });
    fixture = TestBed.createComponent(SuperCategoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
