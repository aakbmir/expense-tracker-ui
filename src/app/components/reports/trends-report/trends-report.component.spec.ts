import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendReportComponent } from './trends-report.component';

describe('TrendReportComponent', () => {
  let component: TrendReportComponent;
  let fixture: ComponentFixture<TrendReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrendReportComponent],
    });
    fixture = TestBed.createComponent(TrendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
