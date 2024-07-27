import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliveredModalComponent } from './order-delivered-modal.component';

describe('OrderDeliveredModalComponent', () => {
  let component: OrderDeliveredModalComponent;
  let fixture: ComponentFixture<OrderDeliveredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDeliveredModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDeliveredModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
