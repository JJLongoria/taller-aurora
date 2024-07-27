import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { MaterialService } from 'src/app/services/material.service';
import { ProductService } from 'src/app/services/product.service';
import { ToolService } from 'src/app/services/tool.service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';

@Component({
  selector: 'app-add-production-modal',
  templateUrl: './add-production-modal.component.html',
  styleUrls: ['./add-production-modal.component.css']
})
export class AddProductionModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent;
  product: IProduct = {} as IProduct;
  productVariant: IProductVariant = {} as IProductVariant;
  mode: DialogMode = DialogMode.View;
  get title(): string {
    return 'Añadir Producción: ' + this.productVariant.name;
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
    units: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  });

  async open(productId: string, variantId: string) {
    this.mode = DialogMode.Edit;
    this.form.reset();
    this.product = this.productService.findById(productId);
    this.productVariant = this.product.variants.find(v => v.id === variantId) as IProductVariant;
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.sm,
    });
  }

  constructor(
    private readonly productService: ProductService,
    private readonly toolService: ToolService,
    private readonly materialService: MaterialService
  ) { }

  ngOnInit(): void {
  }

  async save() {
    this.productVariant.unitsProduced = !this.productVariant.unitsProduced ? (this.form.value.units || 0) : this.productVariant.unitsProduced + (this.form.value.units || 0);
    const index = this.product.variants.findIndex(v => v.id === this.productVariant.id);
    this.product.variants[index] = this.productVariant;
    this.productService.updateById(this.product.id, this.product);
    this.updateRelatedData();
    this.modal.close();
  }

  cancel() {
    this.form.reset();
    this.modal.dismiss();
  }

  updateRelatedData() {
    if (!this.productVariant) {
      return;
    }
    const quantity = this.form.value.units || 0;
    if (this.productVariant?.tools) {
      for (const toolId of this.productVariant?.tools) {
        const tool = this.toolService.findById(toolId);
        tool.uses = tool.uses ? tool.uses + quantity : quantity;
        tool.amortized = tool.uses >= tool.amortizationUses;
        this.toolService.updateById(tool.id, tool);
      }
    }
    if (this.productVariant?.materials) {
      for (const materialData of this.productVariant?.materials) {
        const material = this.materialService.findById(materialData.materialId);
        material.quantity = material.quantity - ((materialData.normalizedQuantity || 0) * quantity);
        if (material.quantity < 0) {
          material.quantity = 0;
        }
        this.materialService.updateById(material.id, material);
      }
    }
  }

}
