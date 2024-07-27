import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { IpcService } from 'src/app/services/ipc.service';
import { MaterialService } from 'src/app/services/material.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { ToolService } from 'src/app/services/tool.service';
import { IMaterial } from 'src/libs/types/material.interface';
import { IProductMaterial, IProductVariant } from 'src/libs/types/product.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { AddProductionModalComponent } from '../add-production-modal/add-production-modal.component';
import { AddSalesModalComponent } from '../add-sales-modal/add-sales-modal.component';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';

@Component({
  selector: 'app-product-variant-modal',
  templateUrl: './product-variant-modal.component.html',
  styleUrls: ['./product-variant-modal.component.css']
})
export class ProductVariantModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent;
  @ViewChild('addProductionModal') private addProductionModal!: AddProductionModalComponent;
  @ViewChild('addSalesModal') private addSalesModal!: AddSalesModalComponent;
  @ViewChild('imageViewerModal') private imageViewerModal!: ImageViewerModalComponent;
  productVariant: IProductVariant = {} as IProductVariant;
  productId: string = '';
  materials: IMaterial[] = [];
  mode: DialogMode = DialogMode.View;
  get title(): string {
    if (this.isNewAction) {
      return 'Nueva Variante de Producto';
    }
    if (this.isEditAction) {
      return 'Editar Variante de Producto: ' + this.productVariant.name;
    }
    return 'Detalles de la Variante de Producto ' + this.productVariant.name;
  }

  get isViewAction() {
    return this.mode === DialogMode.View;
  }

  get isEditAction() {
    return this.mode === DialogMode.Edit;
  }

  get isNewAction() {
    return this.mode === DialogMode.New;
  }

  form = new FormGroup({
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    price: new FormControl<number | null>(null),
    tools: new FormControl<string | string[] | null>(null),
    unitsSold: new FormControl<number | null>(null),
    unitsProduced: new FormControl<number | null>(null),
    materials: new FormArray([
      new FormGroup({
        materialId: new FormControl<string | string[] | null>(null, [Validators.required]),
        scale: new FormControl<string | string[] | null>(null, [Validators.required]),
        quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0.001)]),
        normalizedQuantity: new FormControl<number | null>(null),
        cost: new FormControl<number | null>(null),
        price: new FormControl<number | null>(null),
      })
    ]),
  });
  tmpImg = '';
  imgPath = '';
  previewSrc = '';
  oldImgPath = '';

  constructor(
    public readonly toolService: ToolService,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService,
    private readonly ipcService: IpcService
  ) { }

  ngOnInit(): void {
    this.form.controls.tools.valueChanges.subscribe((value) => {
      this.calculateCost(value);
    });
  }

  async open(mode?: DialogMode, productVariant?: IProductVariant, productId?: string) {
    this.mode = mode || DialogMode.New;
    this.form.reset();
    this.productVariant = productVariant || {} as IProductVariant;
    this.productId = productId || '';
    setTimeout(() => {
      this.mapProductVariantToForm();
    }, 20);
    return this.modal?.open(mode, {
      centered: true,
      size: DialogSize.xl,
    });
  }

  save() {
    this.mapFormToProductVariant();
    let duplicateMaterialError = false;
    for (const materialTmp of this.productVariant.materials) {
      if (this.productVariant.materials.filter((element) => element.materialId === materialTmp.materialId).length > 1) {
        duplicateMaterialError = true;
      }
    }
    if (duplicateMaterialError) {
      this.notificationService.error({
        header: 'Error',
        message: 'Mami, has seleccionado dos materiales iguales para la misma variante de producto... esto no se puede hacer. 😋 Revísalos y eliminar los duplicados.',
      });
      return;
    }
    this.form.reset();
    this.modal.close(this.productVariant);
  }

  cancel() {
    this.ipcService.invoke('deleteFile', this.tmpImg).then(() => {

    });
    this.form.reset();
    this.form.controls.materials.clear();
    this.form.controls.materials.push(
      new FormGroup({
        materialId: new FormControl<string | string[] | null>(null, [Validators.required]),
        scale: new FormControl<string | string[] | null>(null, [Validators.required]),
        quantity: new FormControl<number | null>(null, [Validators.required]),
        normalizedQuantity: new FormControl<number | null>(null),
        cost: new FormControl<number | null>(null),
        price: new FormControl<number | null>(null),
      })
    );
    this.modal.dismiss();
  }

  private mapProductVariantToForm() {
    this.imgPath = this.imgPath || this.productVariant.image || '';
    this.oldImgPath = this.productVariant.image;
    this.previewSrc = 'file:///' + this.imgPath;
    this.form.controls.materials.clear();
    for (let i = 0; i < this.productVariant.materials?.length; i++) {
      this.form.controls.materials.push(new FormGroup({
        materialId: new FormControl<string | string[] | null>(null, [Validators.required]),
        scale: new FormControl<string | string[] | null>(null, [Validators.required]),
        quantity: new FormControl<number | null>(null, [Validators.required]),
        normalizedQuantity: new FormControl<number | null>(null),
        cost: new FormControl<number | null>(null),
        price: new FormControl<number | null>(null),
      }));
    }
    this.form.controls.unitsProduced.setValue(this.productVariant.unitsProduced || null);
    this.form.controls.unitsSold.setValue(this.productVariant.unitsSold || null);
    this.form.controls.name.setValue(this.productVariant.name);
    this.form.controls.description.setValue(this.productVariant.description);
    this.form.controls.tools.setValue(CoreUtils.forceArray(this.productVariant.tools || []) as string[]);
    this.form.controls.materials.setValue(this.productVariant.materials?.map((materialData) => {
      return {
        materialId: materialData.materialId,
        scale: CoreUtils.forceArray(materialData.scale),
        quantity: materialData.quantity,
        normalizedQuantity: materialData.normalizedQuantity || null,
        cost: null,
        price: null,
      };
    }) || []);
    this.calculateCost();
  }

  private mapFormToProductVariant() {
    if (!this.productVariant.id) {
      this.productVariant.id = CoreUtils.createUUID();
    }
    this.productVariant.name = this.form.get('name')?.value || '';
    this.productVariant.description = this.form.get('description')?.value || '';
    this.productVariant.materials = this.form.controls.materials.controls?.map((control: any) => {
      return {
        materialId: Array.isArray(control.controls.materialId.value) ? control.controls.materialId.value[0] : control.controls.materialId.value,
        scale: Array.isArray(control.controls.scale.value) ? control.controls.scale.value[0] : control.controls.scale.value,
        quantity: control.controls.quantity.value,
        normalizedQuantity: control.controls.normalizedQuantity.value,
      };
    }) || [];
    this.productVariant.tools = CoreUtils.forceArray(this.form.get('tools')?.value || []) as string[];
    this.productVariant.image = this.imgPath;
  }

  addMaterial() {
    (this.form.get('materials') as FormArray).push(
      new FormGroup({
        materialId: new FormControl<string | string[] | null>(null, [Validators.required]),
        scale: new FormControl<string | string[] | null>(null, [Validators.required]),
        quantity: new FormControl<number | null>(null, [Validators.required]),
        normalizedQuantity: new FormControl<number | null>(null),
        cost: new FormControl<number | null>(null),
        price: new FormControl<number | null>(null),
      })
    );
  }

  removeMaterial(index: number) {
    (this.form.get('materials') as FormArray).removeAt(index);
    this.calculateCost();
  }

  costChange(data: any) {
    this.calculateCost();
  }

  private calculateCost(tools?: string | string[] | null) {
    let price = 0;
    for (const material of this.form.controls.materials.controls) {
      price += material.value.cost || 0;
    }
    const tmpTools = tools ?? this.form.controls.tools.value;
    if (Array.isArray(tmpTools)) {
      for (const toolId of tmpTools) {
        const tool = this.toolService.findById(toolId);
        price += tool.usePrice || 0;
      }
    } else if (tmpTools) {
      const tool = this.toolService.findById(tmpTools);
      price += tool.usePrice || 0;
    }
    this.form.controls.price.setValue(price);
  }

  edit() {
    this.mode = DialogMode.Edit;
    setTimeout(() => {
      this.mapProductVariantToForm();
    }, 20);
  }

  async addProduction(){
    try {
      this.addProductionModal.open(this.productId, this.productVariant.id);
      const product = this.productService.findById(this.productId);
      this.productVariant = product.variants.find((variant) => variant.id === this.productVariant.id) || this.productVariant;
      setTimeout(() => {
        this.mapProductVariantToForm();
      }, 20);
    } catch (error) {
      console.log(error);
    }
  }

  async addSale(){
    try {
      this.addSalesModal.open(this.productId, this.productVariant.id);
      const product = this.productService.findById(this.productId);
      this.productVariant = product.variants.find((variant) => variant.id === this.productVariant.id) || this.productVariant;
      setTimeout(() => {
        this.mapProductVariantToForm();
      }, 20);
    } catch (error) {
      console.log(error);
    }
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
      if(!this.imgPath){
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
