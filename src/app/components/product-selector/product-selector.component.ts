import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';
import { ProductVariantViewerModalComponent } from '../product-variant-viewer-modal/product-variant-viewer-modal.component';
import { ProductViewerModalComponent } from '../product-viewer-modal/product-viewer-modal.component';

@Component({
  selector: 'app-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.css']
})
export class ProductSelectorComponent implements OnInit {

  @ViewChild('productViewerModal') private productViewerModal!: ProductViewerModalComponent;
  @ViewChild('productVariantViewerModal') private productVariantViewerModal!: ProductVariantViewerModalComponent;
  @Output() onRemove: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCostChange: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Input() isViewAction: boolean = false;
  @Input() isEditAction: boolean = false;
  @Input() isNewAction: boolean = true;
  @Input() index = 0;
  @Input() showCost = true;
  @Input() formGroup = new FormGroup({
    productId: new FormControl<string | string[] | null>(null, [Validators.required]),
    productVariantId: new FormControl<string | string[] | null>(null, [Validators.required]),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0.001)]),
    cost: new FormControl<number | null>(null, [Validators.required]),
  });
  productVariants: IProductVariant[] = [];
  product?: IProduct;
  variant?: IProductVariant;
  loadingVariants = false;

  constructor(
    public readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    this.formGroup.controls.productId.valueChanges.subscribe((value: string | string[] | null) => {
      const val = Array.isArray(value) ? value[0] : value;
      this.product = this.productService.findById(val || '');
      if (this.product) {
        this.productVariants = this.product.variants || [];
      } else {
        this.productVariants = [];
      }
    });
    this.formGroup.controls.productVariantId.valueChanges.subscribe((value: string | string[] | null) => {
      const val = Array.isArray(value) ? value[0] : value;
      if (val && this.product) {
        this.variant = this.product.variants?.find(v => v.id === val);
      } else {
        this.variant = undefined;
      }
    });
    this.formGroup.controls.quantity.valueChanges.subscribe((value: number | null) => {
      if (this.product && this.variant) {
        const variantCost = this.productService.calculateVariantCost(this.variant);
        this.formGroup.controls.cost.setValue(variantCost * (value || 0));
        this.onCostChange.emit();
      } else {
        this.formGroup.controls.cost.setValue(null);
      }
    });
    if (this.formGroup.controls.productId.value) {
      const val = Array.isArray(this.formGroup.controls.productId.value) ? this.formGroup.controls.productId.value[0] : this.formGroup.controls.productId.value;
      this.product = this.productService.findById(val || '');
      if (this.product) {
        this.productVariants = this.product.variants || [];
      } else {
        this.productVariants = [];
      }
    }
    if (this.formGroup.controls.productVariantId.value) {
      const val = Array.isArray(this.formGroup.controls.productVariantId.value) ? this.formGroup.controls.productVariantId.value[0] : this.formGroup.controls.productVariantId.value;
      if (val && this.product) {
        this.variant = this.product.variants?.find(v => v.id === val);
      } else {
        this.variant = undefined;
      }
    }
    if (this.formGroup.controls.quantity.value) {
      if (this.product && this.variant) {
        const variantCost = this.productService.calculateVariantCost(this.variant);
        this.formGroup.controls.cost.setValue(variantCost * (this.formGroup.controls.quantity.value || 0));
        this.onCostChange.emit();
      } else {
        this.formGroup.controls.cost.setValue(null);
      }
    }
  }

  removeProduct() {
    this.onRemove.emit(this.index);
  }

  previewProduct() {
    try {
      const val = Array.isArray(this.formGroup.controls.productId.value) ? this.formGroup.controls.productId.value[0] : this.formGroup.controls.productId.value;
      this.productViewerModal.open(val || '');
    } catch (error) {

    }
  }

  previewVariant() {
    try {
      const productId = Array.isArray(this.formGroup.controls.productId.value) ? this.formGroup.controls.productId.value[0] : this.formGroup.controls.productId.value;
      const val = Array.isArray(this.formGroup.controls.productVariantId.value) ? this.formGroup.controls.productVariantId.value[0] : this.formGroup.controls.productVariantId.value;
      this.productVariantViewerModal.open(productId || '', val || '');
    } catch (error) {

    }
  }

}
