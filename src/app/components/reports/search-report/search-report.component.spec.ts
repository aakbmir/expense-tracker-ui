import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchviewComponent } from './search-report.component';

describe('SearchviewComponent', () => {
  let component: SearchviewComponent;
  let fixture: ComponentFixture<SearchviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchviewComponent]
    });
    fixture = TestBed.createComponent(SearchviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
