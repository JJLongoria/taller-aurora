import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceCalculatorModalComponent } from './price-calculator-modal.component';

describe('PriceCalculatorModalComponent', () => {
  let component: PriceCalculatorModalComponent;
  let fixture: ComponentFixture<PriceCalculatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceCalculatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceCalculatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
