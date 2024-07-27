import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaleSelectorComponent } from './product-sale-selector.component';

describe('ProductSaleSelectorComponent', () => {
  let component: ProductSaleSelectorComponent;
  let fixture: ComponentFixture<ProductSaleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSaleSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSaleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
