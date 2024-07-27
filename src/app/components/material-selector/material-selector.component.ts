import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { MaterialService } from 'src/app/services/material.service';
import { IMaterial } from 'src/libs/types/material.interface';
import { MATERIAL_PRICE_CALCULATION, SCALES } from 'src/libs/utils/constants.utils';
import { MaterialViewerModalComponent } from '../material-viewer-modal/material-viewer-modal.component';

@Component({
  selector: 'app-material-selector',
  templateUrl: './material-selector.component.html',
  styleUrls: ['./material-selector.component.css']
})
export class MaterialSelectorComponent implements OnInit {

  @ViewChild('materialViewerModal') private materialViewerModal!: MaterialViewerModalComponent;
  @Output() onRemove: EventEmitter<number> = new EventEmitter<number>();
  @Output() costChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() isViewAction: boolean = false;
  @Input() isEditAction: boolean = false;
  @Input() isNewAction: boolean = true;
  @Input() index = 0;
  @Input() formGroup = new FormGroup({
    materialId: new FormControl<string | string[] | null>(null, [Validators.required]),
    scale: new FormControl<string | string[] | null>(null, [Validators.required]),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0.001)]),
    normalizedQuantity: new FormControl<number | null>(null),
    cost: new FormControl<number | null>(null),
    price: new FormControl<number | null>(null),
  });
  quantityType: string = this.getQuantityType();
  normalizedQuantityLabel: string = '';
  scale: any;
  scaleOptions?: SelectItem[];
  material?: IMaterial;
  priceLabel?: string;


  constructor(
    public readonly materialService: MaterialService
  ) { }

  ngOnInit(): void {
    this.formGroup.controls.materialId.valueChanges.subscribe((value: string | string[] | null) => {
      const val = Array.isArray(value) ? value[0] : value;
      if (!val) {
        return;
      }
      this.material = this.materialService.findById(val);
      this.scale = SCALES[this.material.priceCalculation as keyof typeof SCALES];
      this.scaleOptions = Object.entries<any>(this.scale).map(([key, value]) => ({ value: key, label: value.label }));
      this.quantityType = this.getQuantityType();
      this.calculatePricesAndCosts();
    });
    this.formGroup.controls.scale.valueChanges.subscribe((value: string | string[] | null) => {
      const val = Array.isArray(value) ? value[0] : value;
      if (!val) {
        return;
      }
      this.quantityType = this.getQuantityType(val);
      this.calculatePricesAndCosts(val);
    });
    this.formGroup.controls.quantity.valueChanges.subscribe((value: number | null) => {
      if (!this.material) {
        return;
      }
      this.calculatePricesAndCosts(undefined, value);
    });
    this.scale = SCALES.g;
    this.scaleOptions = Object.entries<any>(this.scale).map(([key, value]) => ({ value: key, label: value.label }));
    if (this.formGroup.controls.materialId.value) {
      const val = Array.isArray(this.formGroup.controls.materialId.value) ? this.formGroup.controls.materialId.value[0] : this.formGroup.controls.materialId.value;
      this.material = this.materialService.findById(val);
      this.scale = SCALES[this.material.priceCalculation as keyof typeof SCALES];
      this.scaleOptions = Object.entries<any>(this.scale).map(([key, value]) => ({ value: key, label: value.label }));
      this.quantityType = this.getQuantityType();
      this.calculatePricesAndCosts();
    }
    if (this.formGroup.controls.scale.value) {
      const val = Array.isArray(this.formGroup.controls.scale.value) ? this.formGroup.controls.scale.value[0] : this.formGroup.controls.scale.value;
      if (!val) {
        return;
      }
      this.quantityType = this.getQuantityType(val);
      this.calculatePricesAndCosts(val);
    }
    if (this.formGroup.controls.quantity.value) {
      if (!this.material) {
        return;
      }
      this.calculatePricesAndCosts(undefined, this.formGroup.controls.quantity.value);
    }
  }

  getQuantityType(value?: string) {
    const selectedScale = value ? value : Array.isArray(this.formGroup.controls.scale.value) ? this.formGroup.controls.scale.value[0] : this.formGroup.controls.scale.value;
    const scaleData = selectedScale ? this.scale[selectedScale] : null;
    return scaleData?.label || '';
  }

  removeMaterial() {
    this.onRemove.emit(this.index);
  }

  private calculatePricesAndCosts(value?: string | null, quantity?: number | null) {
    const selectedScale = !!value ? value : Array.isArray(this.formGroup.controls.scale.value) ? this.formGroup.controls.scale.value[0] : this.formGroup.controls.scale.value;
    const scaleData = selectedScale ? this.scale[selectedScale] : null;
    const multiplier = scaleData ? scaleData.multiplier : 1;
    const quantityMultiplied = quantity ? (quantity || 0) * multiplier : (this.formGroup.controls.quantity.value || 0) * multiplier;
    this.formGroup.controls.normalizedQuantity.setValue(quantityMultiplied);
    this.normalizedQuantityLabel = MATERIAL_PRICE_CALCULATION[this.material?.priceCalculation as keyof typeof MATERIAL_PRICE_CALCULATION]?.plural;
    const oldCost = this.formGroup.controls.cost.value;
    this.formGroup.controls.cost.setValue((this.material?.highPrice || 0) * quantityMultiplied);
    this.formGroup.controls.price.setValue(this.material?.highPrice || 0);
    this.priceLabel = MATERIAL_PRICE_CALCULATION[this.material?.priceCalculation as keyof typeof MATERIAL_PRICE_CALCULATION]?.label;
    this.costChange.emit({ index: this.index, value });
  }

  previewMaterial() {
    try {
      const val = Array.isArray(this.formGroup.controls.materialId.value) ? this.formGroup.controls.materialId.value[0] : this.formGroup.controls.materialId.value;
      this.materialViewerModal.open(val || '');
    } catch (error) {

    }
  }

}
