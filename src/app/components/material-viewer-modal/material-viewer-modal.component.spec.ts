import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialViewerModalComponent } from './material-viewer-modal.component';

describe('MaterialViewerModalComponent', () => {
  let component: MaterialViewerModalComponent;
  let fixture: ComponentFixture<MaterialViewerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialViewerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
