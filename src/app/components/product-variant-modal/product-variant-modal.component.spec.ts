import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantModalComponent } from './product-variant-modal.component';

describe('ProductVariantModalComponent', () => {
  let component: ProductVariantModalComponent;
  let fixture: ComponentFixture<ProductVariantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVariantModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVariantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
