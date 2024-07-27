import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesModalComponent } from './add-sales-modal.component';

describe('AddSalesModalComponent', () => {
  let component: AddSalesModalComponent;
  let fixture: ComponentFixture<AddSalesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSalesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSalesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
