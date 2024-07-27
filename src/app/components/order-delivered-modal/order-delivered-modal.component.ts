import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { IOrder, IOrderProduct } from 'src/libs/types/order.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';

@Component({
  selector: 'app-order-delivered-modal',
  templateUrl: './order-delivered-modal.component.html',
  styleUrls: ['./order-delivered-modal.component.css']
})
export class OrderDeliveredModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent;
  order: IOrder = {} as IOrder;
  oldOrder: IOrder = {} as IOrder;
  mode: DialogMode = DialogMode.View;
  get title(): string {
    return 'Entregar Encargo: ' + this.order.name;
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
    paidment: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    deliveryDate: new FormControl<Date | string | null>(null, [Validators.required]),
  });

  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {

  }

  async open(orderId: string) {
    this.mode = DialogMode.Edit;
    this.form.reset();
    this.order = this.orderService.findById(orderId);
    this.mapOrderToForm();
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.lg,
    });
  }

  mapOrderToForm() {
    this.oldOrder = CoreUtils.clone(this.order);
    this.form.setValue({
      paidment: this.order.paidment,
      deliveryDate: formatDate(this.order.deliveryDate || new Date(), 'yyyy-MM-dd', 'en'),
    });
  }

  mapFormToOrder() {
    this.order.paidment = this.form.value.paidment || 0;
    this.order.paid = true;
    this.order.deliveryDate = this.form.value.deliveryDate ? new Date(this.form.value.deliveryDate) : undefined;
    this.order.profit = this.order.paidment - this.order.estimatedCostPrice;
  }

  async save() {
    this.mapFormToOrder();
    this.orderService.updateById(this.order.id, this.order);
    this.processRelatedData();
    this.modal.close();
  }

  cancel() {
    this.form.reset();
    this.modal.dismiss();
  }

  processRelatedData() {
    if (!this.oldOrder.paid && this.order.paid) {
      this.order.products.forEach((orderProduct: IOrderProduct) => {
        const quantity = orderProduct.quantity;
        const product = this.productService.findById(orderProduct.productId);
        const variant = product.variants.find((variant) => variant.id === orderProduct.productVariantId);
        if (variant) {
          variant.unitsSold = variant.unitsSold ? variant.unitsSold + quantity : quantity;
          this.productService.updateById(product.id, product);
        }
      });
    }
  }

}
