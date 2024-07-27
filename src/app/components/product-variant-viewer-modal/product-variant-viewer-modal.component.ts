import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { ProductService } from 'src/app/services/product.service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';

@Component({
  selector: 'app-product-variant-viewer-modal',
  templateUrl: './product-variant-viewer-modal.component.html',
  styleUrls: ['./product-variant-viewer-modal.component.css']
})
export class ProductVariantViewerModalComponent implements OnInit {

  @ViewChild('imageViewerModal') private imageViewerModal!: ImageViewerModalComponent;
  @ViewChild('modal') private modal!: ModalComponent;
  mode: DialogMode = DialogMode.View;
  product: IProduct = {} as IProduct;
  variant: IProductVariant = {} as IProductVariant;
  get title(): string {
    return 'Detalles de la Variante de Producto ' + this.variant?.name;
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

  async open(productId: string, variantId: string) {
    this.form.reset();
    this.product = this.productService.findById(productId || '');
    this.variant = this.product.variants.find((v) => { return v.id === variantId }) as IProductVariant;
    this.mapVariantToForm();
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.xl,
    });
  }

  mapVariantToForm() {
    this.previewImg = this.variant.image ? 'file:///' + this.variant.image : '';
    this.form.controls.name.setValue(this.variant.name || '');
    this.form.controls.description.setValue(this.variant.description || '');
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
