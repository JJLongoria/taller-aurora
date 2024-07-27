import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnDefinition, DatatableAction, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { calculateMaxPages } from 'src/app/components/pagination/pagination.component';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { CategoryService } from 'src/app/services/category.service';
import { MaterialService } from 'src/app/services/material.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IMaterial } from 'src/libs/types/material.interface';

@Component({
  selector: 'app-materials-page',
  templateUrl: './materials-page.component.html',
  styleUrls: ['./materials-page.component.css']
})
export class MaterialsPageComponent implements OnInit {

  maxPages = 1;
  currentPage = 1;
  size: number = 200;
  materials: IMaterial[] = [];
  loading = false;
  rowsOffset: number = 0;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/material/view/:id',
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
      name: 'lowPrice',
      label: 'Precio Mínimo',
      type: 'string',
      transform: (row) => {
        return row.lowPrice + ' ' + this.getPriceType(row);
      },
    },
    {
      name: 'highPrice',
      label: 'Precio Máximo',
      type: 'string',
      transform: (row) => {
        return row.highPrice + ' ' + this.getPriceType(row);
      },
    },
    {
      name: 'avgPrice',
      label: 'Precio Medio',
      type: 'string',
      transform: (row) => {
        return (row.lowPrice + row.highPrice) / 2 + ' ' + this.getPriceType(row);
      },
    },
    {
      name: 'quantity',
      label: 'Cantidad',
      type: 'number',
    },
    {
      name: 'categoryIds',
      label: 'Categorías',
      type: 'string',
      transform: (row) => {
        return row.categoryIds.map((id: string) => this.categoryService.findById(id)?.name).join(', ');
      }
    },
    {
      name: 'location',
      label: 'Localización',
      type: 'string',
    }, {
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
      label: 'Todos los Materiales',
      value: 'all',
    },
    {
      label: 'Materiales Útiles',
      value: 'utils',
    },
    {
      label: 'Materiales Cerca de Agostarse',
      value: 'near-to-out-of-stock',
    },
    {
      label: 'Materiales Agotados',
      value: 'out-of-stock',
    },
    {
      label: 'Materiales Obsoletos',
      value: 'obsolete',
    }
  ];
  listViewControl = new FormControl<string | string[] | null>(['all']);

  constructor(
    public readonly materialService: MaterialService,
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    materialService.onLoad.subscribe(() => {
      this.loadMaterials();
      this.maxPages = calculateMaxPages(this.materialService.getAll().length, this.size);
      this.loading = false;
    });
  }

  loadMaterials() {
    const filterValue = Array.isArray(this.listViewControl.value) ? this.listViewControl.value[0] : this.listViewControl.value;
    this.materials = [];
    const start = (this.currentPage - 1) * this.size;
    const end = start + this.size;
    if (filterValue === 'all') {
      this.materials = this.materialService.getAll().slice(start, end);
    } else if (filterValue === 'utils') {
      this.materials = this.materialService.find({ obsolete: false }).slice(start, end);
    } else if (filterValue === 'near-to-out-of-stock') {
      this.materials = this.materialService.getAll().filter((material) => { return material.minThreshold && material.quantity > 0 && material.quantity <= material.minThreshold }).slice(start, end);
    } else if (filterValue === 'out-of-stock') {
      this.materials = this.materialService.getAll().filter((material) => { return material.quantity === 0 }).slice(start, end);
    } else if (filterValue === 'obsolete') {
      this.materials = this.materialService.find({ obsolete: true }).slice(start, end);
    }
    this.rowsOffset = start;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.router.navigate(['/material/view', event.row.id]);
    } else if (event.action.name === 'edit') {
      this.router.navigate(['/material/edit', event.row.id]);
    } else if (event.action.name === 'delete') {
      this.deleteMaterial(event.row.id);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadMaterials();
    this.maxPages = calculateMaxPages(this.materialService.getAll().length, this.size);
    this.loading = false;
    this.listViewControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadMaterials();
    });
  }

  handleClickPage(page: number) {
    this.currentPage = page;
    this.loadMaterials();
  }

  getPriceType(material: IMaterial) {
    if (material.priceCalculation === 'u') {
      return '€/Unidad';
    } else if (material.priceCalculation === 'l') {
      return '€/Litro';
    } else if (material.priceCalculation === 'g') {
      return '€/Gramo';
    } else if (material.priceCalculation === 'm') {
      return '€/Metro';
    } else if (material.priceCalculation === 'm2') {
      return '€/Metro Cuadrado';
    }
    return '€/Unidad';
  }

  async deleteMaterial(id: string) {
    const material = this.materialService.findById(id);
    try {
      await this.notificationService.alert({
        title: 'Eliminar material',
        message: `¿Estás seguro de que quieres eliminar el material ${material?.name}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.materialService.deleteById(id);
      this.notificationService.success({
        header: 'Material eliminado',
        message: `El material ${material?.name} ha sido eliminado correctamente`,
      });
      this.loadMaterials();
    } catch (error) {

    }
  }

}
