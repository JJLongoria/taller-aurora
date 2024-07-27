import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';
import { MathUtils } from 'src/libs/utils/math.utils';
import { ProductVariantViewerModalComponent } from '../product-variant-viewer-modal/product-variant-viewer-modal.component';
import { ProductViewerModalComponent } from '../product-viewer-modal/product-viewer-modal.component';

@Component({
  selector: 'app-product-sale-selector',
  templateUrl: './product-sale-selector.component.html',
  styleUrls: ['./product-sale-selector.component.css']
})
export class ProductSaleSelectorComponent implements OnInit {

  @ViewChild('productViewerModal') private productViewerModal!: ProductViewerModalComponent;
  @ViewChild('productVariantViewerModal') private productVariantViewerModal!: ProductVariantViewerModalComponent;
  @Output() onRemove: EventEmitter<number> = new EventEmitter<number>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() isViewAction: boolean = false;
  @Input() isEditAction: boolean = false;
  @Input() isNewAction: boolean = true;
  @Input() index = 0;
  @Input() formGroup = new FormGroup({
    product: new FormControl<string | string[] | null>(null, [Validators.required]),
    productVariant: new FormControl<string | string[] | null>(null, [Validators.required]),
    units: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    unitPrice: new FormControl<number | null>(null),
    profit: new FormControl<number | null>(null),
  });
  productVariants: IProductVariant[] = [];
  product?: IProduct;
  variant?: IProductVariant;

  constructor(
    public readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    this.formGroup.controls.product.valueChanges.subscribe((value: string | string[] | null) => {
      const val = Array.isArray(value) ? value[0] : value;
      this.product = this.productService.findById(val || '');
      if (this.product) {
        this.productVariants = this.product.variants || [];
      } else {
        this.productVariants = [];
      }
    });
    this.formGroup.controls.productVariant.valueChanges.subscribe((value: string | string[] | null) => {
      const val = Array.isArray(value) ? value[0] : value;
      if (val && this.product) {
        this.variant = this.product.variants?.find(v => v.id === val);
      } else {
        this.variant = undefined;
      }
    });
    this.formGroup.controls.units.valueChanges.subscribe((value) => {
      this.calculatePriceAndProfit(value || 0, this.formGroup.controls.price.value || 0);
    });
    this.formGroup.controls.price.valueChanges.subscribe((value) => {
      this.calculatePriceAndProfit(this.formGroup.controls.units.value || 0, value || 0);
    });

    if (this.formGroup.controls.product.value) {
      const val = Array.isArray(this.formGroup.controls.product.value) ? this.formGroup.controls.product.value[0] : this.formGroup.controls.product.value;
      this.product = this.productService.findById(val || '');
      if (this.product) {
        this.productVariants = this.product.variants || [];
      } else {
        this.productVariants = [];
      }
    }
    if (this.formGroup.controls.productVariant.value) {
      const val = Array.isArray(this.formGroup.controls.productVariant.value) ? this.formGroup.controls.productVariant.value[0] : this.formGroup.controls.productVariant.value;
      if (val && this.product) {
        this.variant = this.product.variants?.find(v => v.id === val);
      } else {
        this.variant = undefined;
      }
    }
    if (this.formGroup.controls.units.value) {
      this.calculatePriceAndProfit(this.formGroup.controls.units.value || 0, this.formGroup.controls.price.value || 0);
    }
    if (this.formGroup.controls.price.value) {
      this.calculatePriceAndProfit(this.formGroup.controls.units.value || 0, this.formGroup.controls.price.value || 0);
    }
    this.calculatePriceAndProfit();
  }

  calculatePriceAndProfit(units?: number, price?: number) {
    if (!this.variant) {
      return;
    }
    const unitsTmp = units ?? this.formGroup.controls.units.value ?? 0;
    const priceTmp = price ?? this.formGroup.controls.price.value ?? 0;
    this.formGroup.controls.unitPrice.setValue(MathUtils.round(priceTmp / unitsTmp, 3));
    const estimatedCost = this.productService.calculateVariantEstimatedCost(this.variant);
    this.formGroup.controls.profit.setValue(MathUtils.round(priceTmp - (estimatedCost * unitsTmp), 3));
    this.onChange.emit();
  }

  removeProduct() {
    this.onRemove.emit(this.index);
  }

  previewProduct() {
    try {
      const val = Array.isArray(this.formGroup.controls.product.value) ? this.formGroup.controls.product.value[0] : this.formGroup.controls.product.value;
      this.productViewerModal.open(val || '');
    } catch (error) {

    }
  }

  previewVariant() {
    try {
      const productId = Array.isArray(this.formGroup.controls.product.value) ? this.formGroup.controls.product.value[0] : this.formGroup.controls.product.value;
      const val = Array.isArray(this.formGroup.controls.productVariant.value) ? this.formGroup.controls.productVariant.value[0] : this.formGroup.controls.productVariant.value;
      this.productVariantViewerModal.open(productId || '', val || '');
    } catch (error) {

    }
  }

}
