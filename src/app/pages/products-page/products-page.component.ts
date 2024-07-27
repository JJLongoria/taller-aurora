import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnDefinition, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { calculateMaxPages } from 'src/app/components/pagination/pagination.component';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { IProduct } from 'src/libs/types/product.interface';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit {

  maxPages = 1;
  currentPage = 1;
  size: number = 200;
  products: IProduct[] = [];
  loading = false;
  rowsOffset: number = 0;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/product/view/:id',
        params: {
          id: 'id',
        }
      },
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'string',
    },
    {
      name: 'variants',
      label: 'Número de Variantes',
      type: 'string',
      transform: (row) => row.variants?.length || 0,
    },
    {
      name: 'lowPrice',
      label: 'Precio Mínimo (€)',
      type: 'number',
      transform: (row) => this.productService.geProductMinCost(row),
    },
    {
      name: 'highPrice',
      label: 'Precio Máximo (€)',
      type: 'number',
      transform: (row) => this.productService.getProductMaxCost(row),
    },
    {
      name: 'avgPrice',
      label: 'Precio Medio (€)',
      type: 'number',
      transform: (row) => this.productService.getProductAvgCost(row),
    },
    {
      name: 'unitsSold',
      label: 'Unidades Vendidas',
      type: 'number',
      transform: (row: IProduct) => {
        return row.variants?.reduce((acc, curr) => acc + (curr.unitsSold || 0), 0) || 0;
      },
    },
    {
      name: 'unitsProduced',
      label: 'Unidades Producidas',
      type: 'number',
      transform: (row: IProduct) => {
        return row.variants?.reduce((acc, curr) => acc + (curr.unitsProduced || 0), 0) || 0;
      },
    },
    {
      name: 'actions',
      label: 'Acciones',
      type: 'action',
      typeAttributes: {
        showAsMenu: true,
      },
      attributes: {
        width: 100,
      },
      rowActions: [
        {
          name: 'view',
          label: 'Ver',
          icon: {
            src: 'preview.svg',
            altText: 'Ver',
            color: 'danger'
          },
        },
        {
          name: 'edit',
          label: 'Editar',
          icon: {
            src: 'edit.svg',
            altText: 'Editar',
            color: 'primary'
          },
        },
        {
          name: 'delete',
          label: 'Eliminar',
          icon: {
            src: 'trash.svg',
            altText: 'Eliminar',
            color: 'danger'
          },
        },
      ]
    }
  ];
  constructor(
    public readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    productService.onLoad.subscribe(() => {
      this.loadProducts();
      this.maxPages = calculateMaxPages(this.productService.getAll().length, this.size);
      this.loading = false;
    });
  }

  loadProducts() {
    this.products = [];
    const start = (this.currentPage - 1) * this.size;
    const end = start + this.size;
    this.products = this.productService.getAll().slice(start, end);
    this.rowsOffset = start;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.router.navigate(['/product/view', event.row.id]);
    } else if (event.action.name === 'edit') {
      this.router.navigate(['/product/edit', event.row.id]);
    } else if (event.action.name === 'delete') {
      this.deleteProduct(event.row.id);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadProducts();
    this.maxPages = calculateMaxPages(this.productService.getAll().length, this.size);
    this.loading = false;
  }

  handleClickPage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  async deleteProduct(id: string) {
    const product = this.productService.findById(id);
    try {
      await this.notificationService.alert({
        title: 'Eliminar producto',
        message: `¿Estás seguro de que quieres eliminar el producto ${product?.name}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.productService.deleteById(id);
      this.notificationService.success({
        header: 'Producto eliminada',
        message: `El Producto ${product?.name} ha sido eliminada correctamente`,
      });
      this.loadProducts();
    } catch (error) {

    }
  }

}
