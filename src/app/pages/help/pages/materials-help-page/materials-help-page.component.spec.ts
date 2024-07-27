import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsHelpPageComponent } from './materials-help-page.component';

describe('MaterialsHelpPageComponent', () => {
  let component: MaterialsHelpPageComponent;
  let fixture: ComponentFixture<MaterialsHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
