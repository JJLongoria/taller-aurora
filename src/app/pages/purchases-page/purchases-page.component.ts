import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnDefinition, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { calculateMaxPages } from 'src/app/components/pagination/pagination.component';
import { NotificationService } from 'src/app/services/notification.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { IPurchase } from 'src/libs/types/purchase.interface';

@Component({
  selector: 'app-purchases-page',
  templateUrl: './purchases-page.component.html',
  styleUrls: ['./purchases-page.component.css']
})
export class PurchasesPageComponent implements OnInit {

  maxPages = 1;
  currentPage = 1;
  size: number = 200;
  purchases: IPurchase[] = [];
  loading = false;
  rowsOffset: number = 0;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/purchase/view/:id',
        params: {
          id: 'id',
        }
      },
    },
    {
      name: 'materials',
      label: 'Materiales',
      type: 'string',
      transform: (row) => {
        return row.materialIds?.length || 0;
      }
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'string',
    },
    {
      name: 'sellername',
      label: 'Vendedor',
      type: 'string',
      transform: (row) => {
        return row.seller.name;
      }
    },
    {
      name: 'quantity',
      label: 'Cantidad',
      type: 'number',
    },
    {
      name: 'totalPrice',
      label: 'Precio Total',
      type: 'number',
    },
    {
      name: 'date',
      label: 'Fecha',
      type: 'date',
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
    public readonly purchaseService: PurchaseService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    purchaseService.onLoad.subscribe(() => {
      this.loadPurchases();
      this.maxPages = calculateMaxPages(this.purchaseService.getAll().length, this.size);
      this.loading = false;
    });
  }

  loadPurchases() {
    this.purchases = [];
    const start = (this.currentPage - 1) * this.size;
    const end = start + this.size;
    this.purchases = this.purchaseService.getAll().slice(start, end);
    this.rowsOffset = start;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.router.navigate(['/purchase/view', event.row.id]);
    } else if (event.action.name === 'edit') {
      this.router.navigate(['/purchase/edit', event.row.id]);
    } else if (event.action.name === 'delete') {
      this.deletePurchase(event.row.id);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadPurchases();
    this.maxPages = calculateMaxPages(this.purchaseService.getAll().length, this.size);
    this.loading = false;
  }

  handleClickPage(page: number) {
    this.currentPage = page;
    this.loadPurchases();
  }

  async deletePurchase(id: string) {
    const purchase = this.purchaseService.findById(id);
    try {
      await this.notificationService.alert({
        title: 'Eliminar compra',
        message: `¿Estás seguro de que quieres eliminar la compra ${purchase?.id}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.purchaseService.deleteById(id);
      this.notificationService.success({
        header: 'Compra eliminada',
        message: `La compra ${purchase?.id} ha sido eliminada correctamente`,
      });
      this.loadPurchases();
    } catch (error) {

    }
  }

}
