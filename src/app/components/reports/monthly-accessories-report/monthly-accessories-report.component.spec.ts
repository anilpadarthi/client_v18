import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyAccessoriesReportComponent } from './monthly-accessories-report.component';

describe('MonthlyAccessoriesReportComponent', () => {
  let component: MonthlyAccessoriesReportComponent;
  let fixture: ComponentFixture<MonthlyAccessoriesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyAccessoriesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyAccessoriesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
