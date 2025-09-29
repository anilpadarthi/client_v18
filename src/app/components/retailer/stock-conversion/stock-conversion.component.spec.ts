import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConversionComponent } from './stock-conversion.component';

describe('StockConversionComponent', () => {
  let component: StockConversionComponent;
  let fixture: ComponentFixture<StockConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockConversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
