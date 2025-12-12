import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerOrderListComponent } from './retailer-order-list.component';

describe('RetailerOrderListComponent', () => {
  let component: RetailerOrderListComponent;
  let fixture: ComponentFixture<RetailerOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetailerOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
