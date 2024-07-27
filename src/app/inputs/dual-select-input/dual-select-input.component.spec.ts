import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualSelectInputComponent } from './dual-select-input.component';

describe('DualSelectInputComponent', () => {
  let component: DualSelectInputComponent;
  let fixture: ComponentFixture<DualSelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualSelectInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DualSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
