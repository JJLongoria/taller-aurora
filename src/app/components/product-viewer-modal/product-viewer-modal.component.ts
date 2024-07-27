import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { ProductService } from 'src/app/services/product.service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';

@Component({
  selector: 'app-product-viewer-modal',
  templateUrl: './product-viewer-modal.component.html',
  styleUrls: ['./product-viewer-modal.component.css']
})
export class ProductViewerModalComponent implements OnInit {

  @ViewChild('imageViewerModal') private imageViewerModal!: ImageViewerModalComponent;
  @ViewChild('modal') private modal!: ModalComponent;
  mode: DialogMode = DialogMode.View;
  product: IProduct = {} as IProduct;
  get title(): string {
    return 'Detalles del Producto ' + this.product?.name;
  }

  form = new FormGroup({
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
  });
  previewImg = '';
  constructor(
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.form.reset();
    this.modal.dismiss();
  }

  async open(productId?: string) {
    this.form.reset();
    this.product = this.productService.findById(productId || '');
    this.mapProductToForm();
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.xl,
    });
  }

  mapProductToForm() {
    this.previewImg = this.product.image ? 'file:///' + this.product.image : '';
    this.form.controls.name.setValue(this.product.name || '');
    this.form.controls.description.setValue(this.product.description || '');
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
