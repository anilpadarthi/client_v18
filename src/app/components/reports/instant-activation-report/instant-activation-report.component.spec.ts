import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantActivationReportComponent } from './instant-activation-report.component';

describe('InstantActivationReportComponent', () => {
  let component: InstantActivationReportComponent;
  let fixture: ComponentFixture<InstantActivationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstantActivationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantActivationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
