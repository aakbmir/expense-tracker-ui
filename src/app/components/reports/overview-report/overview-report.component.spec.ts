import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewReportComponent } from './overview-report.component';

describe('OverviewReportComponent', () => {
  let component: OverviewReportComponent;
  let fixture: ComponentFixture<OverviewReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewReportComponent]
    });
    fixture = TestBed.createComponent(OverviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
