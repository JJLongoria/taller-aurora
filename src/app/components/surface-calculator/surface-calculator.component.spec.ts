import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfaceCalculatorComponent } from './surface-calculator.component';

describe('SurfaceCalculatorComponent', () => {
  let component: SurfaceCalculatorComponent;
  let fixture: ComponentFixture<SurfaceCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurfaceCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurfaceCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
