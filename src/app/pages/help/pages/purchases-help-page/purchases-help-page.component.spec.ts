import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesHelpPageComponent } from './purchases-help-page.component';

describe('PurchasesHelpPageComponent', () => {
  let component: PurchasesHelpPageComponent;
  let fixture: ComponentFixture<PurchasesHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasesHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
