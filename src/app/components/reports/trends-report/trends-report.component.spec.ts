import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendviewComponent } from './trends-report.component';

describe('TrendviewComponent', () => {
  let component: TrendviewComponent;
  let fixture: ComponentFixture<TrendviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrendviewComponent]
    });
    fixture = TestBed.createComponent(TrendviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
