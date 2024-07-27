import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeSelectInputComponent } from './free-select-input.component';

describe('FreeSelectInputComponent', () => {
  let component: FreeSelectInputComponent;
  let fixture: ComponentFixture<FreeSelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeSelectInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
