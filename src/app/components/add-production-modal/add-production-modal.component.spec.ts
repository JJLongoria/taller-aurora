import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionModalComponent } from './add-production-modal.component';

describe('AddProductionModalComponent', () => {
  let component: AddProductionModalComponent;
  let fixture: ComponentFixture<AddProductionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
