import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { MaterialService } from 'src/app/services/material.service';
import { IMaterial } from 'src/libs/types/material.interface';
import { MATERIAL_PRICE_CALCULATION } from 'src/libs/utils/constants.utils';
import { MaterialViewerModalComponent } from '../material-viewer-modal/material-viewer-modal.component';

@Component({
  selector: 'app-purchase-material-selector',
  templateUrl: './purchase-material-selector.component.html',
  styleUrls: ['./purchase-material-selector.component.css']
})
export class PurchaseMaterialSelectorComponent implements OnInit {

  @ViewChild('materialViewerModal') private materialViewerModal!: MaterialViewerModalComponent;
  @Output() onRemove: EventEmitter<number> = new EventEmitter<number>();
  @Input() isViewAction: boolean = false;
  @Input() isEditAction: boolean = false;
  @Input() isNewAction: boolean = true;
  @Input() index = 0;
  @Input() formGroup = new FormGroup({
    materialId: new FormControl<string | null>(null, [Validators.required]),
  });

  material?: IMaterial;
  priceCalculation?: string;
  categories?: string;
  quantityMagnitude?: string;

  constructor(
    public readonly materialService: MaterialService,
    private readonly categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.formGroup.controls.materialId.valueChanges.subscribe((value) => {
      if (value) {
        this.loadData(Array.isArray(value) ? value[0] : value);
      }
    });
    if (this.formGroup.controls.materialId.value) {
      this.loadData(Array.isArray(this.formGroup.controls.materialId.value) ? this.formGroup.controls.materialId.value[0] : this.formGroup.controls.materialId.value);
    }
  }

  removeMaterial() {
    this.onRemove.emit(this.index);
  }

  loadData(materialId: string) {
    this.material = this.materialService.findById(materialId);
    const priceData = MATERIAL_PRICE_CALCULATION[this.material?.priceCalculation || 'g'];
    this.priceCalculation = priceData.label;
    this.quantityMagnitude = this.material.quantity === 1 ? priceData.singular : priceData.plural;
    const catTmp: string[] = [];
    this.material?.categoryIds.forEach((catId) => {
      catTmp.push(this.categoryService.findById(catId)?.name);
    });
    this.categories = catTmp.join(', ');
  }

  previewMaterial() {
    try {
      const val = Array.isArray(this.formGroup.controls.materialId.value) ? this.formGroup.controls.materialId.value[0] : this.formGroup.controls.materialId.value;
      this.materialViewerModal.open(val || '');
    } catch (error) {

    }
  }


}
