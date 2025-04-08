import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCommissionsComponent } from './area-commissions.component';

describe('AreaCommissionsComponent', () => {
  let component: AreaCommissionsComponent;
  let fixture: ComponentFixture<AreaCommissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreaCommissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
