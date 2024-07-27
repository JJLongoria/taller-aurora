import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogMode } from 'src/app/base/modal/modal.component';
import { CategoryModalComponent } from 'src/app/components/category-modal/category-modal.component';
import { ColumnDefinition } from 'src/app/components/datatable/datatable.component';
import { ImageViewerModalComponent } from 'src/app/components/image-viewer-modal/image-viewer-modal.component';
import { PurchaseModalComponent } from 'src/app/components/purchase-modal/purchase-modal.component';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { CategoryService } from 'src/app/services/category.service';
import { IpcService } from 'src/app/services/ipc.service';
import { MaterialService } from 'src/app/services/material.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { IMaterial, IMaterialInput } from 'src/libs/types/material.interface';
import { MATERIAL_PRICE_CALCULATION } from 'src/libs/utils/constants.utils';
import { CoreUtils } from 'src/libs/utils/core.utils';

@Component({
  selector: 'app-material-page',
  templateUrl: './material-page.component.html',
  styleUrls: ['./material-page.component.css']
})
export class MaterialPageComponent implements OnInit {

  @ViewChild('categoryModal') private categoryModal!: CategoryModalComponent;
  @ViewChild('purchaseModal') private purchaseModal!: PurchaseModalComponent;
  @ViewChild('imageViewerModal') private imageViewerModal!: ImageViewerModalComponent;
  action: string = 'new';
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    code: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    lowPrice: new FormControl<number | null>(null),
    highPrice: new FormControl<number | null>(null),
    avgPrice: new FormControl<number | null>(null),
    priceCalculation: new FormControl<'g' | 'l' | 'u' | 'm' | 'm2' | ['g' | 'l' | 'u' | 'm' | 'm2'] | null>('g', [Validators.required]),
    image: new FormControl<string | null>(null),
    qr: new FormControl<string | null>(null),
    category: new FormControl<string[] | null>(null),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    location: new FormControl<string | null>(null),
    minThreshold: new FormControl<number | null>(null, [Validators.min(0)]),
    obsolete: new FormControl<boolean | null>(null),
  });
  material: IMaterialInput = {} as IMaterialInput;
  priceCalculationOptions: SelectItem[] = [
    { value: 'g', label: 'Gramos' },
    { value: 'l', label: 'Litros' },
    { value: 'u', label: 'Unidades' },
    { value: 'm', label: 'Metros' },
    { value: 'm2', label: 'Metros Cuadrados' },
  ];
  loadingCategories = false;
  loadingPurchases = false;
  priceType = this.getPriceType(['u']);
  priceCalculationType = 'Gramos';
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '/purchase/view/:id',
        params: {
          id: 'id',
        },
      }
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'string',
    },
    {
      name: 'seller',
      label: 'Vendedor',
      type: 'string',
      transform: (row) => {
        return row.seller.name;
      },
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
      transform: (row) => {
        return row.totalPrice + ' €';
      },
    },
    {
      name: 'date',
      label: 'Fecha de Compra',
      type: 'date',
    }
  ];


  get title(): string {
    if (this.action === 'new') {
      return 'Nuevo Material';
    }
    if (this.action === 'edit') {
      return 'Editar Material: ' + this.material.name;
    }
    return 'Detalles del Material: ' + this.material.name;
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

  get avgPrice() {
    return ((this.form.controls.lowPrice.value || 0) + (this.form.controls.highPrice.value || 0)) / 2;
  }

  get purchases() {
    return this.purchaseService.getAll().filter(p => this.material.id && p.materialIds?.includes(this.material.id));
  }
  tmpImg = '';
  imgPath = '';
  previewSrc = '';
  oldImgPath = '';

  constructor(
    public readonly categoryService: CategoryService,
    public readonly purchaseService: PurchaseService,
    private readonly materialService: MaterialService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly ipcService: IpcService
  ) {
    this.form.controls.highPrice.valueChanges.subscribe(() => {
      this.form.controls.avgPrice.setValue(this.avgPrice);
    });
    this.form.controls.highPrice.valueChanges.subscribe(() => {
      this.form.controls.avgPrice.setValue(this.avgPrice);
    });
    this.form.controls.priceCalculation.valueChanges.subscribe((value) => {
      this.priceType = this.getPriceType(value || 'u');
      this.priceCalculationType = this.priceCalculationOptions.find(o => o.value === value?.[0])?.label || 'Unidades';
    });
  }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'new';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.material = this.materialService.findById(id) || {} as IMaterialInput;
      this.mapMaterialToForm();
    }
  }

  save(createNew: boolean) {
    this.mapFormToMaterial();
    if (this.isNewAction) {
      this.materialService.createOne(this.material as IMaterial);
    }
    if (this.isEditAction && this.material.id) {
      this.materialService.updateById(this.material.id, this.material as IMaterial);
    }
    if (createNew) {
      this.form.reset();
    } else {
      window.history.back();
    }
  }

  private mapMaterialToForm() {
    this.imgPath = this.material.image || '';
    this.oldImgPath = this.imgPath;
    this.previewSrc = 'file:///' + this.imgPath;
    this.form.patchValue({
      id: this.material.id,
      code: this.material.code,
      name: this.material.name,
      description: this.material.description,
      lowPrice: this.material.lowPrice,
      highPrice: this.material.highPrice,
      avgPrice: this.material.lowPrice + this.material.highPrice / 2,
      priceCalculation: [this.material.priceCalculation],
      image: this.material.image,
      qr: this.material.qr,
      category: this.material.categoryIds,
      quantity: this.material.quantity,
      location: this.material.location,
      obsolete: this.material.obsolete,
    });
  }

  private mapFormToMaterial() {
    this.material.code = this.form.get('code')?.value || '';
    this.material.name = this.form.get('name')?.value || '';
    this.material.description = this.form.get('description')?.value || undefined;
    this.material.lowPrice = this.form.get('lowPrice')?.value || 0;
    this.material.highPrice = this.form.get('highPrice')?.value || 0;
    this.material.priceCalculation = Array.isArray(this.form.value.priceCalculation) ? this.form.value.priceCalculation[0] : this.form.value.priceCalculation || 'g';
    this.material.image = this.imgPath;
    this.material.qr = this.form.get('qr')?.value || undefined;
    this.material.categoryIds = this.form.get('category')?.value || [];
    this.material.quantity = this.form.get('quantity')?.value || 0;
    this.material.location = this.form.get('location')?.value || undefined;
    this.material.obsolete = this.form.get('obsolete')?.value || false;
  }

  cancel() {
    this.ipcService.invoke('deleteFile', this.tmpImg).then(() => {

    });
    this.form.reset();
    this.form.reset();
    window.history.back();
  }

  async newCategory() {
    try {
      this.loadingCategories = true;
      await this.categoryModal.open(DialogMode.New);
    } catch (error) {
      console.log(error);
    }
    this.loadingCategories = false;
  }

  async newPurchase() {
    try {
      this.loadingPurchases = true;
      await this.purchaseModal.open(DialogMode.New, undefined, this.material.id);
    } catch (error) {
      console.log(error);
    }
    this.loadingPurchases = false;
  }

  getPriceType(value: string | string[]) {
    const val = Array.isArray(value) ? value[0] : value;
    return MATERIAL_PRICE_CALCULATION[val].label || MATERIAL_PRICE_CALCULATION.label;
  }

  edit() {
    this.action = 'edit';
  }

  clickOnImage() {
    if (this.isEditAction || this.isNewAction) {
      this.ipcService.invoke('selectImage', CoreUtils.createUUID()).then((filePath) => {
        if (filePath) {
          this.ipcService.invoke('deleteFile', this.tmpImg).then(() => {
            this.tmpImg = filePath;
            this.imgPath = filePath;
            this.previewSrc = 'file:///' + this.imgPath;
          }).catch((error) => {
            console.log(error);
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      if (!this.imgPath) {
        return;
      }
      try {
        this.imageViewerModal.open(this.previewSrc);
      } catch (error) {
        console.log(error);
      }
    }
  }

}
