import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsHelpPageComponent } from './tools-help-page.component';

describe('ToolsHelpPageComponent', () => {
  let component: ToolsHelpPageComponent;
  let fixture: ComponentFixture<ToolsHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolsHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
