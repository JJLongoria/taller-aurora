import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { MaterialService } from 'src/app/services/material.service';
import { IMaterial } from 'src/libs/types/material.interface';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';

@Component({
  selector: 'app-material-viewer-modal',
  templateUrl: './material-viewer-modal.component.html',
  styleUrls: ['./material-viewer-modal.component.css']
})
export class MaterialViewerModalComponent implements OnInit {

  @ViewChild('imageViewerModal') private imageViewerModal!: ImageViewerModalComponent;
  @ViewChild('modal') private modal!: ModalComponent;
  mode: DialogMode = DialogMode.View;
  material: IMaterial = {} as IMaterial;
  get title(): string {
    return 'Detalles del Material ' + this.material?.name;
  }

  form = new FormGroup({
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
  });
  previewImg = '';
  constructor(
    private readonly materialService: MaterialService
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.form.reset();
    this.modal.dismiss();
  }

  async open(productId?: string) {
    this.form.reset();
    this.material = this.materialService.findById(productId || '');
    this.mapProductToForm();
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.xl,
    });
  }

  mapProductToForm() {
    this.previewImg = this.material.image ? 'file:///' + this.material.image : '';
    this.form.controls.name.setValue(this.material.name || '');
    this.form.controls.description.setValue(this.material.description || '');
  }

  clickOnImage() {
    if (!this.previewImg) {
      return;
    }
    try {
      this.imageViewerModal.open(this.previewImg);
    } catch (error) {
      console.log(error);
    }
  }
}
