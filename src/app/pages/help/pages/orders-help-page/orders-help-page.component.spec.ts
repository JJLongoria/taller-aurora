import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersHelpPageComponent } from './orders-help-page.component';

describe('OrdersHelpPageComponent', () => {
  let component: OrdersHelpPageComponent;
  let fixture: ComponentFixture<OrdersHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
