import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionStatementsComponent } from './commission-statements.component';

describe('CommissionStatementsComponent', () => {
  let component: CommissionStatementsComponent;
  let fixture: ComponentFixture<CommissionStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommissionStatementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
