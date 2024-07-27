import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnDefinition, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { calculateMaxPages } from 'src/app/components/pagination/pagination.component';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { ISale } from 'src/libs/types/sale.interface';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.css']
})
export class SalesPageComponent implements OnInit {

  maxPages = 1;
  currentPage = 1;
  size: number = 200;
  sales: ISale[] = [];
  loading = false;
  rowsOffset: number = 0;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/sale/view/:id',
        params: {
          id: 'id',
        }
      },
    },
    {
      name: 'products',
      label: 'Nº de Productos',
      type: 'string',
      transform: (sale: ISale) => {
        return sale.products?.length || 0;
      },
    },
    {
      name: 'salesDate',
      label: 'Fecha de Venta',
      type: 'date',
    },
    {
      name: 'units',
      label: 'Unidades',
      type: 'number',
    },
    {
      name: 'price',
      label: 'Precio (€)',
      type: 'number',
    },
    {
      name: 'profit',
      label: 'Beneficios (€)',
      type: 'number',
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
    public readonly saleService: SaleService,
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    saleService.onLoad.subscribe(() => {
      this.loadSales();
      this.maxPages = calculateMaxPages(this.saleService.getAll().length, this.size);
      this.loading = false;
    });
  }

  loadSales() {
    this.sales = [];
    const start = (this.currentPage - 1) * this.size;
    const end = start + this.size;
    this.sales = this.saleService.getAll().slice(start, end);
    this.rowsOffset = start;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.router.navigate(['/sale/view', event.row.id]);
    } else if (event.action.name === 'edit') {
      this.router.navigate(['/sale/edit', event.row.id]);
    } else if (event.action.name === 'delete') {
      this.deleteSale(event.row.id);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadSales();
    this.maxPages = calculateMaxPages(this.saleService.getAll().length, this.size);
    this.loading = false;
  }

  handleClickPage(page: number) {
    this.currentPage = page;
    this.loadSales();
  }

  async deleteSale(id: string) {
    const tool = this.saleService.findById(id);
    try {
      await this.notificationService.alert({
        title: 'Eliminar herramienta',
        message: `¿Estás seguro de que quieres eliminar la herramienta ${tool?.name}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.saleService.deleteById(id);
      this.notificationService.success({
        header: 'Herramienta eliminada',
        message: `La herramienta ${tool?.name} ha sido eliminada correctamente`,
      });
      this.loadSales();
    } catch (error) {

    }
  }

}
