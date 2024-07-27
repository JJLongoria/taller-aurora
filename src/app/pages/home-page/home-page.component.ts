import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { ClientService } from 'src/app/services/client.service';
import { MaterialService } from 'src/app/services/material.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { SaleService } from 'src/app/services/sale.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  loading = false;
  filesLoaded = 0;
  totalFiles = 8;

  constructor(
    private readonly materialService: MaterialService,
    private readonly categoryService: CategoryService,
    private readonly clientService: ClientService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly purchaseService: PurchaseService,
    private readonly toolService: ToolService,
    private readonly saleService: SaleService
  ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.materialService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.categoryService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.clientService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.orderService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.productService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.purchaseService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.toolService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.saleService.onLoad.subscribe(() => {
      this.filesLoaded++;
      if (this.filesLoaded === this.totalFiles) {
        this.loading = false;
      }
    });
    this.loading = !this.materialService.isDataLoaded && !this.saleService.isDataLoaded && !this.categoryService.isDataLoaded && !this.clientService.isDataLoaded && !this.orderService.isDataLoaded && !this.productService.isDataLoaded && !this.purchaseService.isDataLoaded && !this.toolService.isDataLoaded;
  }

}
