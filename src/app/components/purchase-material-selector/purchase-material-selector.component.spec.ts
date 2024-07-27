import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMaterialSelectorComponent } from './purchase-material-selector.component';

describe('PurchaseMaterialSelectorComponent', () => {
  let component: PurchaseMaterialSelectorComponent;
  let fixture: ComponentFixture<PurchaseMaterialSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseMaterialSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseMaterialSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
