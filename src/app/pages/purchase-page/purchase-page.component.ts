import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SurfaceCalculatorComponent } from 'src/app/components/surface-calculator/surface-calculator.component';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { MaterialService } from 'src/app/services/material.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { IMaterial } from 'src/libs/types/material.interface';
import { IPurchase, IPurchaseInput } from 'src/libs/types/purchase.interface';
import { SCALES, getPurchasePriceCalculation, MATERIAL_PRICE_CALCULATION, PURCHASE_PRICE_CALCULATION } from 'src/libs/utils/constants.utils';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { MathUtils } from 'src/libs/utils/math.utils';
import { StrUtils } from 'src/libs/utils/str.utils';

@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.component.html',
  styleUrls: ['./purchase-page.component.css']
})
export class PurchasePageComponent implements OnInit {

  @ViewChild('surfaceCalculatorModal') private surfaceCalculatorModal!: SurfaceCalculatorComponent
  action: string = 'new';
  purchase: IPurchaseInput = {} as IPurchaseInput;
  oldPurchase: IPurchaseInput = {} as IPurchaseInput;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    sellerName: new FormControl<string | null>(null, [Validators.required]),
    sellerUrl: new FormControl<string | null>(null, [Validators.required]),
    materialIds: new FormArray([
      new FormGroup({
        materialId: new FormControl<string | null>(null, [Validators.required]),
      })
    ]),
    scale: new FormControl<string | string[] | null>(null),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0.001)]),
    units: new FormControl<number | null>(null),
    totalPrice: new FormControl<number | null>(null, [Validators.required, Validators.min(0.001)]),
    relativePrice: new FormControl<number | null>(0),
    priceCalculation: new FormControl<'g' | 'g/u' | 'l' | 'l/u' | 'u' | 'm' | 'm/u' | 'm2' | 'm2/u' | ['g' | 'g/u' | 'l' | 'l/u' | 'u' | 'm' | 'm/u' | 'm2' | 'm2/u'] | null>('g', [Validators.required]),
    date: new FormControl<Date | null>(new Date(), [Validators.required]),
    notUpdateMaterialsPrice: new FormControl<boolean | null>(false),
    notUpdateMaterialsQuantity: new FormControl<boolean | null>(false),
  });
  priceCalculationOptions: SelectItem[] = getPurchasePriceCalculation();
  scaleOptions?: SelectItem[];
  showUnits = false;
  quantityLabel = 'Cantidad';
  materialsLabel = 'Material';
  multiMaterial = false;
  scale: any;
  relativePrice: number | null = null;
  unitPrice: string | null = null;
  priceCalculation?: string | 'g' | 'l' | 'u' | 'm' | 'm2' | null = null;
  calculateSurface = false;
  get title(): string {
    if (this.action === 'new') {
      return 'Nueva Compra';
    }
    if (this.action === 'edit') {
      return 'Editar Compra: ' + this.purchase.name;
    }
    return 'Detalles de la Compra: ' + this.purchase.name;
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

  constructor(
    public readonly materialService: MaterialService,
    private readonly purchaseService: PurchaseService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'new';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const scale = SCALES.g;
    this.scale = scale;
    this.showUnits = false;
    this.scaleOptions = Object.entries<any>(scale).map(([key, value]) => ({ value: key, label: value.label }));
    if (id) {
      this.purchase = this.purchaseService.findById(id) || {} as IPurchaseInput;
      this.mapPurchaseToForm();
    }
    this.calculateRelativePrice();
    this.form.controls.priceCalculation.valueChanges.subscribe((value) => {
      try {
        if (value?.[0]) {
          this.showUnits = value?.[0]?.includes('/u') || false;
          this.multiMaterial = value?.[0]?.includes('/u');
          const val = value?.[0]?.replace('/u', '');
          this.calculateSurface = val === 'm2';
          const scale = SCALES[val as keyof typeof SCALES];
          this.materialsLabel = this.multiMaterial ? `Materiales (${this.form.value.materialIds?.length || 0})` : 'Material';
          if(this.showUnits){
            this.form.controls.units.setValidators([Validators.required, Validators.min(1)]);
          } else {
            this.form.controls.units.clearValidators();
          }
          if (scale) {
            this.scale = scale;
            this.scaleOptions = Object.entries<any>(scale).map(([key, value]) => ({ value: key, label: value.label }));
            this.form.controls.scale.addValidators([Validators.required]);
          } else {
            this.scale = undefined;
            this.scaleOptions = undefined;
            this.form.controls.scale.clearValidators();
          }
          this.quantityLabel = 'Cantidad';
          this.form.controls.scale.setValue(null, { emitEvent: false });
          this.form.controls.quantity.setValue(null, { emitEvent: false });
          this.form.controls.units.setValue(null, { emitEvent: false });
        }
        this.calculateRelativePrice();
      } catch (error) {
        console.log(error);
      }
    });
    this.form.controls.scale.valueChanges.subscribe((value) => {
      if (value?.[0]) {
        const scale = this.scale[value[0]];
        this.quantityLabel = scale?.label || 'Cantidad';
      } else {
        this.quantityLabel = 'Cantidad';
        this.form.controls.quantity.setValue(null);
        this.form.controls.units.setValue(null);
      }
      this.calculateRelativePrice();
    });
    this.form.controls.totalPrice.valueChanges.subscribe((value) => {
      this.calculateRelativePrice();
    });
    this.form.controls.quantity.valueChanges.subscribe((value) => {
      this.calculateRelativePrice();
    });
    this.form.controls.units.valueChanges.subscribe((value) => {
      this.calculateRelativePrice();
    });
  }

  save(createNew: boolean) {
    this.mapFormToPurchase();
    if (this.showUnits && this.purchase.materialIds?.length !== this.purchase.units) {
      this.notificationService.error({
        header: 'Error',
        message: 'Mami, la cantidad de materiales no coincide con la cantidad de unidades... 😋 Revísalos y elimina los que no correspondan.',
      });
      return;
    }
    let priceCalculationError = false;
    let duplicateMaterialError = false;
    for (const materialId of this.purchase.materialIds) {
      const material = this.materialService.findById(materialId);
      if (material.priceCalculation !== PURCHASE_PRICE_CALCULATION[this.purchase.priceCalculation].materialValue) {
        priceCalculationError = true;
      }
      if (this.purchase.materialIds.filter((id) => id === materialId).length > 1) {
        duplicateMaterialError = true;
      }
    }
    if (priceCalculationError) {
      this.notificationService.error({
        header: 'Error',
        message: 'Mami, has seleccionado un material con un tipo de cálculo de precio diferente al de la compra... 😋 Revísalos y elimina los que no correspondan.',
      });
      return;
    }
    if (duplicateMaterialError) {
      this.notificationService.error({
        header: 'Error',
        message: 'Mami, has seleccionado dos materiales iguales en la misma compra... esto no se puede hacer. 😋 Revísalos y eliminar los duplicados.',
      });
      return;
    }
    if (this.isNewAction) {
      this.purchaseService.createOne(this.purchase as IPurchase);
    }
    if (this.isEditAction && this.purchase.id) {
      this.purchaseService.updateById(this.purchase.id, this.purchase as IPurchase);
    }
    this.updateMaterials();
    if (createNew) {
      this.form.reset();
      this.purchase = {} as IPurchaseInput;
      this.oldPurchase = {} as IPurchaseInput;
    } else {
      window.history.back();
    }
  }

  private mapPurchaseToForm() {
    this.form.controls.materialIds.clear();
    for (const materialId of this.purchase.materialIds) {
      this.form.controls.materialIds.push(new FormGroup({
        materialId: new FormControl<string | null>(null, [Validators.required]),
      }));
    }
    this.oldPurchase = CoreUtils.clone(this.purchase);
    this.showUnits = this.purchase.priceCalculation.includes('/u') || false;
    this.multiMaterial = this.showUnits;
    this.materialsLabel = this.multiMaterial ? `Materiales (${this.form.value.materialIds?.length || 0})` : 'Material';
    this.priceCalculation = this.purchase.priceCalculation.replace('/u', '');
    this.scale = SCALES[this.priceCalculation];
    this.scaleOptions = Object.entries<any>(this.scale).map(([key, value]) => ({ value: key, label: value.label }));
    this.form.patchValue({
      id: this.purchase.id || null,
      description: this.purchase.description || null,
      sellerName: this.purchase.seller.name,
      sellerUrl: this.purchase.seller.url,
      materialIds: this.purchase.materialIds.map((materialId) => {
        return { materialId: materialId }
      }),
      quantity: this.purchase.quantity,
      totalPrice: this.purchase.totalPrice,
      relativePrice: this.purchase.relativePrice,
      priceCalculation: this.purchase.priceCalculation,
      date: this.purchase.date,
      units: this.purchase.units || null,
      notUpdateMaterialsPrice: !this.purchase.updateMaterialsPrice,
      scale: this.purchase.scale,
    });
    this.form.controls.priceCalculation.setValue([this.purchase.priceCalculation]);
    this.form.controls.scale.setValue([this.purchase.scale]);
  }

  private mapFormToPurchase() {
    this.purchase.description = this.form.get('description')?.value || '';
    this.purchase.seller = {
      name: this.form.get('sellerName')?.value || '',
      url: this.form.get('sellerUrl')?.value || '',
    };
    this.purchase.materialIds = this.form.value.materialIds?.map((group) => Array.isArray(group.materialId) ? group.materialId[0] : group.materialId) || [];
    this.purchase.quantity = this.form.get('quantity')?.value || 0;
    this.purchase.totalPrice = this.form.get('totalPrice')?.value || 0;
    this.purchase.relativePrice = this.form.get('relativePrice')?.value || 0;
    this.purchase.priceCalculation = Array.isArray(this.form.value.priceCalculation) ? this.form.value.priceCalculation[0] : this.form.value.priceCalculation || 'g';
    this.purchase.date = this.form.get('date')?.value || new Date();
    this.purchase.units = this.form.get('units')?.value || 0;
    this.purchase.updateMaterialsPrice = !this.form.get('notUpdateMaterialsPrice')?.value;
    this.purchase.scale = Array.isArray(this.form.value.scale) ? this.form.value.scale[0] : this.form.value.scale || '';
  }

  cancel() {
    this.form.reset();
    window.history.back();
  }

  private calculateRelativePrice() {
    const priceCalculation = this.form.controls.priceCalculation.value?.[0] || '';
    const selectedScale = this.form.controls.scale.value?.[0];
    const scaleData = this.scale && selectedScale && this.scale[selectedScale] ? this.scale[selectedScale] : undefined;
    const multiplier = scaleData ? scaleData.multiplier : 1;
    const price = this.form.controls.totalPrice.value;
    const quantity = (this.form.controls.quantity.value || 0);
    const quantityMultiplied = quantity * multiplier;
    const units = this.form.controls.units.value;
    this.priceCalculation = priceCalculation.replace('/u', '');
    this.unitPrice = PURCHASE_PRICE_CALCULATION[priceCalculation]?.material;
    if (price && quantityMultiplied && units && this.showUnits) {
      this.relativePrice = MathUtils.round(price / (quantityMultiplied * units), 6);
    } else if (price && quantityMultiplied) {
      this.relativePrice = MathUtils.round(price / quantityMultiplied, 6);
    } else {
      this.relativePrice = null;
    }
    this.form.controls.relativePrice.setValue(this.relativePrice);
  }

  async openSurfaceCalculator() {
    try {
      const result = await this.surfaceCalculatorModal.open(this.quantityLabel?.replace('Cuadrados', '')?.trim());
      this.form.controls.quantity.setValue(result);
    } catch (error) {

    }
  }

  updateMaterials() {
    const newQuantity = this.getNewQuantity();
    const oldQuantity = this.getOldQuantity();
    if (this.isNewAction) {
      this.purchase.materialIds.forEach((materialId) => {
        const material = this.materialService.findById(materialId);
        if (material && this.form.controls.relativePrice.value) {
          if (this.purchase.updateMaterialsPrice) {
            if (material.highPrice < this.form.controls.relativePrice.value) {
              material.highPrice = this.relativePrice || 0;
            }
            if (material.lowPrice > this.form.controls.relativePrice.value) {
              material.lowPrice = this.relativePrice || 0;
            }
          }
          if (this.purchase.updateMaterialsQuantity) {
            material.quantity += MathUtils.floatify(newQuantity) ?? 0;
          }
          if (this.purchase.updateMaterialsQuantity || this.purchase.updateMaterialsPrice) {
            this.materialService.updateById(material.id, material);
          }
        }
      });
    }
    if (this.isEditAction) {
      const materialsToUpdate: { [key: string]: IMaterial } = {};
      this.oldPurchase.materialIds.forEach((materialId) => {
        const material = this.materialService.findById(materialId);
        if (material && this.form.controls.relativePrice.value) {
          if (this.purchase.updateMaterialsQuantity) {
            material.quantity -= MathUtils.floatify(oldQuantity) ?? 0;
          }
          materialsToUpdate[materialId] = material;
        }
      });
      this.purchase.materialIds.forEach((materialId) => {
        const material = materialsToUpdate[materialId] || this.materialService.findById(materialId);
        if (material && this.form.controls.relativePrice.value) {
          if (this.purchase.updateMaterialsPrice) {
            if (material.highPrice < this.form.controls.relativePrice.value) {
              material.highPrice = this.relativePrice || 0;
            }
            if (material.lowPrice > this.form.controls.relativePrice.value) {
              material.lowPrice = this.relativePrice || 0;
            }
          }
          if (this.purchase.updateMaterialsQuantity) {
            material.quantity += MathUtils.floatify(newQuantity) ?? 0;
          }
          if (this.purchase.updateMaterialsQuantity || this.purchase.updateMaterialsPrice) {
            this.materialService.updateById(material.id, material);
          }
        }
      });
      Object.keys(materialsToUpdate).forEach((materialId) => {
        materialsToUpdate[materialId].quantity = MathUtils.round(materialsToUpdate[materialId].quantity, 3);
        this.materialService.updateById(materialId, materialsToUpdate[materialId]);
      });
    }
  }

  getNewQuantity() {
    const selectedScale = this.purchase.scale;
    const scaleData = this.scale && selectedScale && this.scale[selectedScale] ? this.scale[selectedScale] : undefined;
    const multiplier = scaleData ? scaleData.multiplier : 1;
    const quantity = (this.purchase.quantity ?? 0);
    const quantityMultiplied = quantity * multiplier;
    return MathUtils.round(quantityMultiplied, 3);
  }

  getOldQuantity() {
    const val = this.oldPurchase.priceCalculation?.replace('/u', '');
    const scale: any = SCALES[val as keyof typeof SCALES];
    const selectedScale = this.oldPurchase.scale;
    const scaleData = scale && selectedScale && scale[selectedScale] ? scale[selectedScale] : undefined;
    const multiplier = scaleData ? scaleData.multiplier : 1;
    const quantity = (this.oldPurchase?.quantity ?? 0);
    const quantityMultiplied = quantity * multiplier;
    return MathUtils.round(quantityMultiplied, 3);
  }

  addMaterial() {
    this.form.controls.materialIds.push(new FormGroup({
      materialId: new FormControl<string | null>(null, [Validators.required]),
    }));
    this.materialsLabel = this.multiMaterial ? `Materiales (${this.form.value.materialIds?.length || 0})` : 'Material';
  }

  removeMaterial(index: number) {
    this.form.controls.materialIds.removeAt(index);
    this.materialsLabel = this.multiMaterial ? `Materiales (${this.form.value.materialIds?.length || 0})` : 'Material';
  }

  edit() {
    this.action = 'edit';
  }

}
