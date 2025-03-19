import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingMetricsComponent } from './outstanding-metrics.component';

describe('OutstandingMetricsComponent', () => {
  let component: OutstandingMetricsComponent;
  let fixture: ComponentFixture<OutstandingMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutstandingMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutstandingMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
