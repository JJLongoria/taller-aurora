import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderDeliveredModalComponent } from 'src/app/components/order-delivered-modal/order-delivered-modal.component';
import { ClientService } from 'src/app/services/client.service';
import { OrderService } from 'src/app/services/order.service';
import { IOrder, IOrderInput, IOrderProduct } from 'src/libs/types/order.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { MathUtils } from 'src/libs/utils/math.utils';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {

  @ViewChild('orderDeliveredModal') private orderDeliveredModal!: OrderDeliveredModalComponent;
  action: string = 'new';
  order: IOrderInput = {} as IOrderInput;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    clientId: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    products: new FormArray([
      new FormGroup({
        productId: new FormControl<string | string[] | null>(null),
        productVariantId: new FormControl<string | string[] | null>(null),
        quantity: new FormControl<number | null>(null),
        cost: new FormControl<number | null>(null),
      }),
    ]),
    price: new FormControl<number | null>(null),
    costPrice: new FormControl<number | null>(null),
    estimatedCostPrice: new FormControl<number | null>(null),
    paid: new FormControl<boolean | null>(null),
    paidment: new FormControl<number | null>(null),
    estimatedProfit: new FormControl<number | null>(null),
    profit: new FormControl<number | null>(null),
    deliveryDate: new FormControl<string | null>(null),
    estimatedDeliveryDate: new FormControl<string | null>(null, [Validators.required]),
  });

  get title(): string {
    if (this.action === 'new') {
      return 'Nuevo Encargo';
    }
    if (this.action === 'edit') {
      return 'Editar Encargo: ' + this.order.name;
    }
    return 'Detalles del Encargo: ' + this.order.name;
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
    public readonly clientService: ClientService,
    private readonly orderService: OrderService,
    private readonly activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'new';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.order = this.orderService.findById(id) || {} as IOrderInput;
      setTimeout(() => {
        this.mapOrderToForm();
      }, 20);
    }
  }

  save(createNew: boolean) {
    this.mapFormToOrder();
    if (this.isNewAction) {
      this.orderService.createOne(this.order as IOrder);
    }
    if (this.isEditAction && this.order.id) {
      this.orderService.updateById(this.order.id, this.order as IOrder);
    }
    if (createNew) {
      this.form.reset();
    } else {
      window.history.back();
    }
  }

  private mapOrderToForm() {
    this.form.controls.products.clear();
    this.order.products?.forEach((product: IOrderProduct) => {
      this.form.controls.products.push(new FormGroup({
        productId: new FormControl<string | string[] | null>(null),
        productVariantId: new FormControl<string | string[] | null>(null),
        quantity: new FormControl<number | null>(null),
        cost: new FormControl<number | null>(null),
      }))
    });
    this.form.patchValue({
      id: this.order.id,
      clientId: this.order.client,
      description: this.order.description,
      products: CoreUtils.forceArray<IOrderProduct>(this.order.products || []).map((product: IOrderProduct) => {
        return {
          productId: product.productId,
          productVariantId: product.productVariantId,
          quantity: product.quantity,
        };
      }),
      price: this.order.price,
      costPrice: this.order.costPrice,
      estimatedCostPrice: this.order.estimatedCostPrice,
      paid: this.order.paid,
      paidment: this.order.paidment,
      estimatedProfit: this.order.estimatedProfit,
      profit: this.order.profit,
      deliveryDate: this.order.deliveryDate ? formatDate(this.order.deliveryDate, 'yyyy-MM-dd', 'en') : null,
      estimatedDeliveryDate: formatDate(this.order.estimatedDeliveryDate, 'yyyy-MM-dd', 'en')
    });
  }

  private mapFormToOrder() {
    this.order = {
      id: this.order.id,
      name: this.order.name,
      number: this.order.number,
      description: this.form.controls.description.value || '',
      client: Array.isArray(this.form.controls.clientId.value) ? this.form.controls.clientId.value[0] : this.form.controls.clientId.value || '',
      products: CoreUtils.forceArray(this.form.controls.products.value || []).map((product: any) => {
        return {
          productId: Array.isArray(product.productId) ? product.productId[0] : product.productId || '',
          productVariantId: Array.isArray(product.productVariantId) ? product.productVariantId[0] : product.productVariantId || '',
          quantity: product.quantity || 0,
        };
      }),
      price: this.form.controls.price.value || 0,
      costPrice: this.form.controls.costPrice.value || 0,
      estimatedCostPrice: this.form.controls.estimatedCostPrice.value || 0,
      paid: this.form.controls.paid.value || false,
      paidment: this.form.controls.paidment.value || 0,
      estimatedProfit: this.form.controls.estimatedProfit.value || 0,
      profit: this.form.controls.profit.value || 0,
      deliveryDate: this.form.controls.deliveryDate.value ? new Date(this.form.controls.deliveryDate.value) : undefined,
      estimatedDeliveryDate: this.form.controls.estimatedDeliveryDate.value ? new Date(this.form.controls.estimatedDeliveryDate.value) : new Date()
    };
  }

  cancel() {
    this.form.reset();
    this.form.controls.products.clear();
    this.form.controls.products.push(new FormGroup({
      productId: new FormControl<string | string[] | null>(null),
      productVariantId: new FormControl<string | string[] | null>(null),
      quantity: new FormControl<number | null>(null),
      cost: new FormControl<number | null>(null),
    }))
    window.history.back();
  }

  removeProduct(index: number) {
    (this.form.controls.products as FormArray).removeAt(index);
    this.calculateCost();
  }

  addProduct() {
    (this.form.controls.products as FormArray).push(new FormGroup({
      productId: new FormControl<string | string[] | null>(null),
      productVariantId: new FormControl<string | string[] | null>(null),
      quantity: new FormControl<number | null>(null),
      cost: new FormControl<number | null>(null),
    }));
  }

  costChange() {
    this.calculateCost();
  }

  calculateCost() {
    let cost = 0;
    for (const productData of this.form.controls.products.controls) {
      cost += productData.controls.cost.value || 0;
    }
    const estimatedCostPrice = cost * 1.1;
    const price = estimatedCostPrice * 3;
    this.form.controls.costPrice.setValue(MathUtils.round(cost, 3));
    this.form.controls.estimatedCostPrice.setValue(MathUtils.round(estimatedCostPrice, 3));
    this.form.controls.price.setValue(MathUtils.round(price, 3));
    this.form.controls.estimatedProfit.setValue(MathUtils.round(price - estimatedCostPrice, 3));
  }

  edit() {
    this.action = 'edit';
    setTimeout(() => {
      this.mapOrderToForm();
    }, 20);
  }

  async deliveredOrder(){
    try {
      await this.orderDeliveredModal.open(this.order.id || '');
      this.order = this.orderService.findById(this.order.id || '') || {} as IOrderInput;
      setTimeout(() => {
        this.mapOrderToForm();
      }, 20);
    } catch (error) {
      console.log(error);
    }
  }

}
