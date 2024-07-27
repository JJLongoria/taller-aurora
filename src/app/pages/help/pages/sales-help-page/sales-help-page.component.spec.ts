import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHelpPageComponent } from './sales-help-page.component';

describe('SalesHelpPageComponent', () => {
  let component: SalesHelpPageComponent;
  let fixture: ComponentFixture<SalesHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
