import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';
import { ISale, ISaleInput } from 'src/libs/types/sale.interface';
import { MathUtils } from 'src/libs/utils/math.utils';

@Component({
  selector: 'app-add-sales-modal',
  templateUrl: './add-sales-modal.component.html',
  styleUrls: ['./add-sales-modal.component.css']
})
export class AddSalesModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent;
  product: IProduct = {} as IProduct;
  productVariant: IProductVariant = {} as IProductVariant;
  mode: DialogMode = DialogMode.View;
  sale: ISaleInput = {} as ISaleInput;
  get title(): string {
    return 'Venta de ' + this.productVariant.name;
  }

  get isViewAction() {
    return this.mode === DialogMode.View;
  }

  get isEditAction() {
    return this.mode === DialogMode.Edit;
  }

  get isNewAction() {
    return this.mode === DialogMode.New;
  }

  form = new FormGroup({
    units: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    salesDate: new FormControl<Date | string | null>(null, [Validators.required]),
    unitPrice: new FormControl<number | null>(null),
    profit: new FormControl<number | null>(null),
  });

  async open(productId: string, variantId: string) {
    this.mode = DialogMode.Edit;
    this.form.reset();
    this.product = this.productService.findById(productId);
    this.productVariant = this.product.variants.find(v => v.id === variantId) as IProductVariant;
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.xl,
    });
  }

  constructor(
    private readonly productService: ProductService,
    private readonly saleService: SaleService,
  ) { }

  ngOnInit(): void {
    this.form.controls.units.valueChanges.subscribe((value) => {
      this.calculatePriceAndProfit(value || 0, this.form.value.price || 0);
    });
    this.form.controls.price.valueChanges.subscribe((value) => {
      this.calculatePriceAndProfit(this.form.value.units || 0, value || 0);
    });
  }
  
  mapFormToSale() {
    this.sale = {
      units: this.form.value.units || 0,
      price: this.form.value.price || 0,
      salesDate: this.form.value.salesDate ? new Date(this.form.value.salesDate) : new Date(),
      profit: this.form.value.profit || 0,
      products: [
        {
          product: this.product.id,
          productVariant: this.productVariant.id,
          units: this.form.value.units || 0,
          price: this.form.value.price || 0,
          unitPrice: this.form.value.unitPrice || 0,
          profit: this.form.value.profit || 0,
        }
      ],
    }
  }

  calculatePriceAndProfit(units?: number, price?: number) {
    if(!this.productVariant){
      return;
    }
    const unitsTmp = units ?? this.form.value.units ?? 0;
    const priceTmp = price ?? this.form.value.price ?? 0;
    this.form.controls.unitPrice.setValue(MathUtils.round(priceTmp / unitsTmp, 3));
    const estimatedCost = this.productService.calculateVariantEstimatedCost(this.productVariant);
    this.form.controls.profit.setValue(MathUtils.round(priceTmp - (estimatedCost * unitsTmp), 3));
  }

  async save() {
    this.mapFormToSale();
    this.saleService.createOne(this.sale as ISale);
    this.updateRelatedData();
    this.modal.close();
  }

  cancel() {
    this.form.reset();
    this.modal.dismiss();
  }

  updateRelatedData() {
    if (!this.productVariant) {
      return;
    }
    this.productVariant.unitsSold = !this.productVariant.unitsSold ? (this.form.value.units || 0) : this.productVariant.unitsSold + (this.form.value.units || 0);
    const index = this.product.variants.findIndex(v => v.id === this.productVariant.id);
    this.product.variants[index] = this.productVariant;
    this.productService.updateById(this.product.id, this.product);
  }

}
