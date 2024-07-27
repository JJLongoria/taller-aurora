import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColumnDefinition } from 'src/app/components/datatable/datatable.component';
import { ClientService } from 'src/app/services/client.service';
import { OrderService } from 'src/app/services/order.service';
import { IClient, IClientInput } from 'src/libs/types/client.interface';
import { IOrder } from 'src/libs/types/order.interface';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})
export class ClientPageComponent implements OnInit {

  action: string = 'new';
  client: IClientInput = {} as IClientInput;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, [Validators.required]),
    alias: new FormControl<string | null>(null),
  });
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
      label: 'Precio Recomendado (€)',
      type: 'number',
    },
    {
      name: 'estimatedProfit',
      label: 'Beneficio Estimado (€)',
      type: 'number',
    },
    {
      name: 'profit',
      label: 'Beneficio (€)',
      type: 'number',
    },
  ];

  get title(): string {
    if (this.action === 'new') {
      return 'Nuevo Cliente';
    }
    if (this.action === 'edit') {
      return 'Editar Cliente: ' + this.client.name;
    }
    return 'Detalles del Cliente: ' + this.client.name;
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
  loadingOrders = false;
  get orders() {
    return this.orderService.find({ client: this.client.id });
  }

  constructor(
    private readonly clientService: ClientService,
    private readonly orderService: OrderService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'new';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.client = this.clientService.findById(id) || {} as IClientInput;
      this.mapToolToForm();
    }
  }

  ngOnInit(): void {
  }

  save(createNew: boolean) {
    this.mapFormToTool();
    if (this.isNewAction) {
      this.clientService.createOne(this.client as IClient);
    }
    if (this.isEditAction && this.client.id) {
      this.clientService.updateById(this.client.id, this.client as IClient);
    }
    if (createNew) {
      this.form.reset();
    } else {
      window.history.back();
    }
  }

  private mapToolToForm() {
    this.form.patchValue({
      id: this.client.id,
      name: this.client.name,
      alias: this.client.alias,
    });
  }

  private mapFormToTool() {
    this.client = {
      id: this.client.id,
      name: this.form.controls.name.value || '',
      alias: this.form.controls.alias.value || '',
    };
  }

  cancel() {
    this.form.reset();
    window.history.back();
  }

  edit() {
    this.action = 'edit';
  }

}
