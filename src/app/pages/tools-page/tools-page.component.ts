import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnDefinition, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { calculateMaxPages } from 'src/app/components/pagination/pagination.component';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolService } from 'src/app/services/tool.service';
import { ITool } from 'src/libs/types/tool.interface';

@Component({
  selector: 'app-tools-page',
  templateUrl: './tools-page.component.html',
  styleUrls: ['./tools-page.component.css']
})
export class ToolsPageComponent implements OnInit {

  maxPages = 1;
  currentPage = 1;
  size: number = 200;
  tools: ITool[] = [];
  loading = false;
  rowsOffset: number = 0;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/tool/view/:id',
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
      name: 'price',
      label: 'Precio (€)',
      type: 'number',
    },
    {
      name: 'amortizationUses',
      label: 'Usos para amortización',
      type: 'number',
    },
    {
      name: 'usePrice',
      label: 'Precio por Uso (€)',
      type: 'number',
    },
    {
      name: 'amortized',
      label: 'Amortizada',
      type: 'boolean',
    },
    {
      name: 'electric',
      label: 'Eléctrica',
      type: 'boolean',
    },
    {
      name: 'power',
      label: 'Potencia (W)',
      type: 'number',
    },
    {
      name: 'consumption',
      label: 'Consumo',
      type: 'number',
    },
    {
      name: 'broken',
      label: 'Rota / En Desuso',
      type: 'boolean',
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
  listViewOptions: SelectItem[] = [
    {
      label: 'Todas las Herramientas',
      value: 'all',
    },
    {
      label: 'Herramientas Sin Amortizar',
      value: 'notAmortized',
    },
    {
      label: 'Herramientas Amortizadas',
      value: 'amortized',
    },
    {
      label: 'Herramientas Rotas o En Desuso',
      value: 'broken',
    },
  ];
  listViewControl = new FormControl<string | string[] | null>(['all']);


  constructor(
    public readonly toolService: ToolService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    toolService.onLoad.subscribe(() => {
      this.loadTools();
      this.maxPages = calculateMaxPages(this.toolService.getAll().length, this.size);
      this.loading = false;
    });
  }

  loadTools() {
    const filterValue = Array.isArray(this.listViewControl.value) ? this.listViewControl.value[0] : this.listViewControl.value;
    this.tools = [];
    const start = (this.currentPage - 1) * this.size;
    const end = start + this.size;
    if (filterValue === 'all') {
      this.tools = this.toolService.getAll().slice(start, end);
    } else if (filterValue === 'notAmortized') {
      this.tools = this.toolService.find({ amortized: false }).slice(start, end);
    } else if (filterValue === 'amortized') {
      this.tools = this.toolService.find({ amortized: true }).slice(start, end);
    } else if (filterValue === 'broken') {
      this.tools = this.toolService.find({ broken: true }).slice(start, end);
    }
    
    this.rowsOffset = start;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.router.navigate(['/tool/view', event.row.id]);
    } else if (event.action.name === 'edit') {
      this.router.navigate(['/tool/edit', event.row.id]);
    } else if (event.action.name === 'delete') {
      this.deleteTool(event.row.id);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadTools();
    this.maxPages = calculateMaxPages(this.toolService.getAll().length, this.size);
    this.loading = false;
    this.listViewControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadTools();
    });
  }

  handleClickPage(page: number) {
    this.currentPage = page;
    this.loadTools();
  }

  async deleteTool(id: string) {
    const tool = this.toolService.findById(id);
    try {
      await this.notificationService.alert({
        title: 'Eliminar herramienta',
        message: `¿Estás seguro de que quieres eliminar la herramienta ${tool?.name}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.toolService.deleteById(id);
      this.notificationService.success({
        header: 'Herramienta eliminada',
        message: `La herramienta ${tool?.name} ha sido eliminada correctamente`,
      });
      this.loadTools();
    } catch (error) {

    }
  }

}
