import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableModalComponent } from './dynamic-table-modal.component';

describe('DynamicTableModalComponent', () => {
  let component: DynamicTableModalComponent;
  let fixture: ComponentFixture<DynamicTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicTableModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
