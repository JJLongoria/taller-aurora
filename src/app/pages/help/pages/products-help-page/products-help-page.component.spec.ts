import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHelpPageComponent } from './products-help-page.component';

describe('ProductsHelpPageComponent', () => {
  let component: ProductsHelpPageComponent;
  let fixture: ComponentFixture<ProductsHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
