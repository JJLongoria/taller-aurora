import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsHelpPageComponent } from './clients-help-page.component';

describe('ClientsHelpPageComponent', () => {
  let component: ClientsHelpPageComponent;
  let fixture: ComponentFixture<ClientsHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
