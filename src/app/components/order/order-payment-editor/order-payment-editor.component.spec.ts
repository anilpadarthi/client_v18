import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentEditorComponent } from './order-payment-editor.component';

describe('OrderPaymentEditorComponent', () => {
  let component: OrderPaymentEditorComponent;
  let fixture: ComponentFixture<OrderPaymentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderPaymentEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPaymentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
