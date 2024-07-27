import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnDefinition, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { calculateMaxPages } from 'src/app/components/pagination/pagination.component';
import { ClientService } from 'src/app/services/client.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IClient } from 'src/libs/types/client.interface';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.css']
})
export class ClientsPageComponent implements OnInit {

  maxPages = 1;
  currentPage = 1;
  size: number = 200;
  clients: IClient[] = [];
  loading = false;
  rowsOffset: number = 0;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/client/view/:id',
        params: {
          id: 'id',
        }
      },
    },
    {
      name: 'alias',
      label: 'Alias',
      type: 'string',
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
    public readonly clientService: ClientService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    clientService.onLoad.subscribe(() => {
      this.loadClients();
      this.maxPages = calculateMaxPages(this.clientService.getAll().length, this.size);
      this.loading = false;
    });
  }

  loadClients() {
    this.clients = [];
    const start = (this.currentPage - 1) * this.size;
    const end = start + this.size;
    this.clients = this.clientService.getAll().slice(start, end);
    this.rowsOffset = start;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.router.navigate(['/client/view', event.row.id]);
    } else if (event.action.name === 'edit') {
      this.router.navigate(['/client/edit', event.row.id]);
    } else if (event.action.name === 'delete') {
      this.deleteTool(event.row.id);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadClients();
    this.maxPages = calculateMaxPages(this.clientService.getAll().length, this.size);
    this.loading = false;
  }

  handleClickPage(page: number) {
    this.currentPage = page;
    this.loadClients();
  }

  async deleteTool(id: string) {
    const client = this.clientService.findById(id);
    try {
      await this.notificationService.alert({
        title: 'Eliminar Cliente',
        message: `¿Estás seguro de que quieres eliminar el cliente ${client?.name}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.clientService.deleteById(id);
      this.notificationService.success({
        header: 'Cliente eliminado',
        message: `El cliente ${client?.name} ha sido eliminado correctamente`,
      });
      this.loadClients();
    } catch (error) {

    }
  }
}
