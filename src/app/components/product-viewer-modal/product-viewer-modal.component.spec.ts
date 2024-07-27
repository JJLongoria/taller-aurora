import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductViewerModalComponent } from './product-viewer-modal.component';

describe('ProductViewerModalComponent', () => {
  let component: ProductViewerModalComponent;
  let fixture: ComponentFixture<ProductViewerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductViewerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
