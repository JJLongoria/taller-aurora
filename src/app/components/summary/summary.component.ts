import { Component, OnInit } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { SaleService } from 'src/app/services/sale.service';
import { ToolService } from 'src/app/services/tool.service';
import { IMaterial } from 'src/libs/types/material.interface';
import { IOrder } from 'src/libs/types/order.interface';
import { IProduct } from 'src/libs/types/product.interface';
import { IPurchase } from 'src/libs/types/purchase.interface';
import { ITool } from 'src/libs/types/tool.interface';
import { MATERIAL_PRICE_CALCULATION } from 'src/libs/utils/constants.utils';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { DateUtils } from 'src/libs/utils/date.utils';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  loading = false;

  totalExpends: number = 0;
  materialExpends: number = 0;
  toolExpends: number = 0;

  salesIncomes: number = 0;
  ordersIncomes: number = 0;
  totalIncomes: number = 0;
  profits: number = 0;
  profitsStyle = '';

  nextOrders: IOrder[] = [];
  dueDateOrders: IOrder[] = [];

  nextMaterialPurchases: IMaterial[] = [];
  mostSoldProducts: any[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly materialService: MaterialService,
    private readonly purchaseService: PurchaseService,
    private readonly toolService: ToolService,
    private readonly orderService: OrderService,
    private readonly saleService: SaleService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.purchaseService.getAll().forEach((purchase: IPurchase) => {
      this.materialExpends += purchase.totalPrice;
    });
    this.toolService.getAll().forEach((tool: ITool) => {
      this.toolExpends += tool.price;
    });
    this.totalExpends = this.materialExpends + this.toolExpends;
    const nextOrdersTmp: IOrder[] = [];
    const dueDateOrdersTmp: IOrder[] = [];
    this.orderService.getAll().forEach((order) => {
      if (order.paid) {
        this.ordersIncomes += order.paidment;
      } else {
        const daysInterval = DateUtils.intervalInDays(new Date(), new Date(order.estimatedDeliveryDate));
        console.log(daysInterval);
        if (daysInterval <= 7 && daysInterval >= 0 && nextOrdersTmp.length < 5) {
          nextOrdersTmp.push(order);
        }
        if (daysInterval < 0 && dueDateOrdersTmp.length < 5) {
          dueDateOrdersTmp.push(order);
        }
      }
    });
    this.nextOrders = CoreUtils.sort<IOrder>(nextOrdersTmp, ['estimatedDeliveryDate']);
    this.dueDateOrders = CoreUtils.sort<IOrder>(dueDateOrdersTmp, ['estimatedDeliveryDate']);
    this.saleService.find({ paid: true }).forEach((sale) => {
      this.salesIncomes += sale.price;
    });
    console.log(this.dueDateOrders);
    this.totalIncomes = this.salesIncomes + this.ordersIncomes;
    this.profits = this.totalIncomes - this.totalExpends;
    this.profitsStyle = this.profits >= 0 ? 'background-color: darkgreen; color: white' : 'background-color: red; color: white';

    this.materialService.getAll().forEach((material: IMaterial) => {
      if ((material.minThreshold && material.quantity <= material.minThreshold) || material.quantity <= 0) {
        this.nextMaterialPurchases.push(material);
      }
    });

    const mostSoldProductsTmp: any[] = [];
    this.productService.getAll().forEach((product: IProduct) => {
      mostSoldProductsTmp.push({
        product: product,
        unitsSold: product.variants.reduce((acc, variant) => acc + (variant.unitsSold || 0), 0)
      });
    });
    this.mostSoldProducts = CoreUtils.sortReverse<any>(mostSoldProductsTmp, ['unitsSold']).slice(0, 5);

    this.loading = false;
  }

  getMaterialPriceCalculation(material: IMaterial): string {
    return material.quantity === 1 ? MATERIAL_PRICE_CALCULATION[material.priceCalculation].singular : MATERIAL_PRICE_CALCULATION[material.priceCalculation].plural;
  }

}
