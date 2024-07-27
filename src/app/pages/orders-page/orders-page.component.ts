import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnDefinition, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { calculateMaxPages } from 'src/app/components/pagination/pagination.component';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { ClientService } from 'src/app/services/client.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { IOrder } from 'src/libs/types/order.interface';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit {

  maxPages = 1;
  currentPage = 1;
  size: number = 200;
  orders: IOrder[] = [];
  loading = false;
  rowsOffset: number = 0;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/order/view/:id',
        params: {
          id: 'id',
        }
      },
    },
    {
      name: 'client',
      label: 'Cliente',
      type: 'string',
      transform: (row: any) => {
        return this.clientService.findById(row.client)?.name;
      }
    },
    {
      name: 'products',
      label: 'Productos',
      type: 'number',
      transform: (row: any) => {
        return row.products?.length || 0;
      }
    },
    {
      name: 'costPrice',
      label: 'Coste (€)',
      type: 'number',
    },
    {
      name: 'estimatedCostPrice',
      label: 'Coste Estimado (€)',
      type: 'number',
    },
    {
      name: 'price',
      label: 'PVP (€)',
      type: 'number',
    },
    {
      name: 'estimatedProfit',
      label: 'Beneficio Estimado (€)',
      type: 'number',
    },
    {
      name: 'paid',
      label: 'Pagado',
      type: 'boolean',
    },
    {
      name: 'paidment',
      label: 'Pago (€)',
      type: 'number',
    },
    {
      name: 'profit',
      label: 'Beneficio (€)',
      type: 'number',
    },
    {
      name: 'actions',
      label: 'Acciones',
      type: 'action',
      typeAttributes: {
        showAsMenu: true,
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
  listViewOptions: SelectItem[] = [
    {
      label: 'Todos los Encargos',
      value: 'all',
    },
    {
      label: 'Encargos Pendientes',
      value: 'pending',
    },
    {
      label: 'Encargos Entregados',
      value: 'delivered',
    }
  ];
  listViewControl = new FormControl<string | string[] | null>(['all']);
  constructor(
    public readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    orderService.onLoad.subscribe(() => {
      this.loadOrders();
      this.maxPages = calculateMaxPages(this.orderService.getAll().length, this.size);
      this.loading = false;
    });
  }

  loadOrders() {
    const filterValue = Array.isArray(this.listViewControl.value) ? this.listViewControl.value[0] : this.listViewControl.value;
    this.orders = [];
    const start = (this.currentPage - 1) * this.size;
    const end = start + this.size;
    this.orders = filterValue === 'all' ? this.orderService.getAll().slice(start, end) : filterValue === 'pending' ? this.orderService.find({ paid: false }).slice(start, end) : this.orderService.find({ paid: true }).slice(start, end);
    this.rowsOffset = start;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.router.navigate(['/order/view', event.row.id]);
    } else if (event.action.name === 'edit') {
      this.router.navigate(['/order/edit', event.row.id]);
    } else if (event.action.name === 'delete') {
      this.deleteMaterial(event.row.id);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadOrders();
    this.maxPages = calculateMaxPages(this.orderService.getAll().length, this.size);
    this.loading = false;
    this.listViewControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadOrders();
    });
  }

  handleClickPage(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  async deleteMaterial(id: string) {
    const order = this.orderService.findById(id);
    try {
      await this.notificationService.alert({
        title: 'Eliminar Encargo',
        message: `¿Estás seguro de que quieres eliminar el encargo ${order?.id}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.orderService.deleteById(id);
      this.notificationService.success({
        header: 'Encargo eliminado',
        message: `El encargo ${order?.id} ha sido eliminado correctamente`,
      });
      this.loadOrders();
    } catch (error) {

    }
  }

}
