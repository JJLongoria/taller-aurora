import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantViewerModalComponent } from './product-variant-viewer-modal.component';

describe('ProductVariantViewerModalComponent', () => {
  let component: ProductVariantViewerModalComponent;
  let fixture: ComponentFixture<ProductVariantViewerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVariantViewerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVariantViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
