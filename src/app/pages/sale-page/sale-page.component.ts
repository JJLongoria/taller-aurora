import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';
import { IProductSale, ISale, ISaleInput } from 'src/libs/types/sale.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { MathUtils } from 'src/libs/utils/math.utils';

@Component({
  selector: 'app-sale-page',
  templateUrl: './sale-page.component.html',
  styleUrls: ['./sale-page.component.css']
})
export class SalePageComponent implements OnInit {

  action: string = 'new';
  sale: ISaleInput = {} as ISaleInput;
  oldSale: ISaleInput = {} as ISaleInput;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    products: new FormArray([
      new FormGroup({
        product: new FormControl<string | string[] | null>(null, [Validators.required]),
        productVariant: new FormControl<string | string[] | null>(null, [Validators.required]),
        units: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        unitPrice: new FormControl<number | null>(null),
        profit: new FormControl<number | null>(null),
      }),
    ]),
    units: new FormControl<number | null>(null),
    price: new FormControl<number | null>(null),
    profit: new FormControl<number | null>(null),
    salesDate: new FormControl<string | null>(null, [Validators.required]),
  });
  product?: IProduct;
  productVariant?: IProductVariant;
  productVariants: IProductVariant[] = [];

  get title(): string {
    if (this.action === 'new') {
      return 'Nueva Venta';
    }
    if (this.action === 'edit') {
      return 'Editar Venta: ' + this.sale.name;
    }
    return 'Detalles de la Venta: ' + this.sale.name;
  }

  get isViewAction() {
    return this.action === 'view';
  }

  get isEditAction() {
    return this.action === 'edit';
  }

  get isNewAction() {
    return this.action === 'new';
  }

  constructor(
    private readonly saleService: SaleService,
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'new';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.sale = this.saleService.findById(id) || {} as ISaleInput;
      setTimeout(() => {
        this.mapSaleToForm();
      }, 20);
    }
  }

  

  save(createNew: boolean) {
    this.mapFormToSale();
    if (this.isNewAction) {
      this.saleService.createOne(this.sale as ISale);
    }
    if (this.isEditAction && this.sale.id) {
      this.saleService.updateById(this.sale.id, this.sale as ISale);
    }
    this.updateProduct();
    if (createNew) {
      this.form.reset();
    } else {
      window.history.back();
    }
  }

  private mapSaleToForm() {
    this.form.controls.products.clear();
    this.sale.products?.forEach((product) => {
      this.form.controls.products.push(new FormGroup({
        product: new FormControl<string | string[] | null>(null, [Validators.required]),
        productVariant: new FormControl<string | string[] | null>(null, [Validators.required]),
        units: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        unitPrice: new FormControl<number | null>(null),
        profit: new FormControl<number | null>(null),
      }));
    });
    this.oldSale = CoreUtils.clone(this.sale);
    this.form.patchValue({
      id: this.sale.id,
      name: this.sale.name,
      units: this.sale.units,
      price: this.sale.price,
      profit: this.sale.profit,
      salesDate: this.sale.salesDate ? formatDate(this.sale.salesDate, 'yyyy-MM-dd', 'en') : null,
      products: this.sale.products?.map((product: IProductSale) => {
        return {
          product: product.product,
          productVariant: product.productVariant,
          units: product.units,
          price: product.price,
          unitPrice: product.unitPrice,
          profit: product.profit,
        };
      }),
    });
  }

  private mapFormToSale() {
    this.sale = {
      id: this.sale.id,
      name: this.sale.name,
      number: this.sale.number,
      products: this.form.controls.products.controls?.map((control: any) => {
        return {
          product: Array.isArray(control.controls.product.value) ? control.controls.product.value[0] : control.controls.product.value,
          productVariant: Array.isArray(control.controls.productVariant.value) ? control.controls.productVariant.value[0] : control.controls.productVariant.value,
          units: control.controls.units.value || 0,
          price: control.controls.price.value || 0,
          unitPrice: control.controls.unitPrice.value || 0,
          profit: control.controls.profit.value || 0,
        };
      }) || [],
      units: this.form.controls.units.value || 0,
      price: this.form.controls.price.value || 0,
      profit: this.form.controls.profit.value || 0,
      salesDate: this.form.controls.salesDate.value ? new Date(this.form.controls.salesDate.value) : new Date(),
    };
  }

  private updateProduct() {
    if (!this.productVariant || !this.product) {
      return;
    }
    if (this.isNewAction) {
      this.productVariant.unitsSold = !this.productVariant.unitsSold ? this.sale.units : this.productVariant.unitsSold + this.sale.units;
      const index = this.product.variants.findIndex(v => v.id === this.productVariant?.id);
      this.product.variants[index] = this.productVariant;
      this.productService.updateById(this.product.id, this.product);
    }
    if (this.isEditAction) {
      this.productVariant.unitsSold = !this.productVariant.unitsSold ? this.sale.units : this.productVariant.unitsSold + this.sale.units;
      this.productVariant.unitsSold = this.productVariant.unitsSold - this.oldSale.units;
      const index = this.product.variants.findIndex(v => v.id === this.productVariant?.id);
      this.product.variants[index] = this.productVariant;
      this.productService.updateById(this.product.id, this.product);
    }
  }

  cancel() {
    this.form.reset();
    window.history.back();
  }

  edit() {
    this.action = 'edit';
    setTimeout(() => {
      this.mapSaleToForm();
    }, 20);
  }

  addProduct() {
    this.form.controls.products.push(
      new FormGroup({
        product: new FormControl<string | string[] | null>(null, [Validators.required]),
        productVariant: new FormControl<string | string[] | null>(null, [Validators.required]),
        units: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        unitPrice: new FormControl<number | null>(null),
        profit: new FormControl<number | null>(null),
      }),
    );
  }

  removeProduct(index: number) {
    this.form.controls.products.removeAt(index);
    this.updatePrices();
  }

  onProductChange(){
    this.updatePrices();
  }

  updatePrices(){
    let units = 0;
    let profit = 0;
    let price = 0;
    for(const control of this.form.controls.products.controls){
      units += control.controls.units.value || 0;
      profit += control.controls.profit.value || 0;
      price += control.controls.price.value || 0;
    }
    this.form.controls.units.setValue(units);
    this.form.controls.profit.setValue(MathUtils.round(profit, 3));
    this.form.controls.price.setValue(MathUtils.round(price, 3));
  }
}
