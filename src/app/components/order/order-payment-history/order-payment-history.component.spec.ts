import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentHistoryComponent } from './order-payment-history.component';

describe('OrderPaymentHistoryComponent', () => {
  let component: OrderPaymentHistoryComponent;
  let fixture: ComponentFixture<OrderPaymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderPaymentHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
