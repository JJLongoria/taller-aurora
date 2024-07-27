import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { PurchaseService } from 'src/app/services/purchase.service';
import { IPurchase, IPurchaseInput } from 'src/libs/types/purchase.interface';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.css']
})
export class PurchaseModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent
  get title(): string {
    if (this.isNewAction) {
      return 'Nueva Compra';
    }
    if (this.isEditAction) {
      return 'Editar Compra: ' + this.purchase.id;
    }
    return 'Detalles de la Compra ' + this.purchase.id;
  }
  purchase: IPurchaseInput = {} as IPurchaseInput;
  mode: DialogMode = DialogMode.View;
  priceCalculationOptions: SelectItem[] = [
    { value: 'g', label: 'Gramos' },
    { value: 'g/u', label: 'Gramos/Unidad' },
    { value: 'l', label: 'Litros' },
    { value: 'l/u', label: 'Litros/Unidad' },
    { value: 'u', label: 'Unidades' },
    { value: 'm', label: 'Metros' },
    { value: 'm/u', label: 'Metros/Unidad' },
    { value: 'm2', label: 'Metros Cuadrados' },
    { value: 'm2/u', label: 'Metros Cuadrados/Unidad' },
  ];
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    sellerName: new FormControl<string | null>(null, [Validators.required]),
    sellerUrl: new FormControl<string | null>(null, [Validators.required]),
    materialId: new FormControl<string | null>(null, [Validators.required]),
    scale: new FormControl<string | null>(null),
    quantity: new FormControl<number | null>(null, [Validators.required]),
    units: new FormControl<number | null>(null),
    totalPrice: new FormControl<number | null>(null, [Validators.required]),
    relativePrice: new FormControl<number | null>(0, [Validators.required]),
    priceCalculation: new FormControl<'g' | 'g/u' | 'l' | 'l/u' | 'u' | 'm' | 'm/u' | 'm2' | 'm2/u' | null>('g', [Validators.required]),
    date: new FormControl<Date | null>(new Date(), [Validators.required]),
    notUpdateMaterials: new FormControl<boolean | null>(false),
  });

  get isViewAction() {
    return this.mode === DialogMode.View;
  }

  get isEditAction() {
    return this.mode === DialogMode.Edit;
  }

  get isNewAction() {
    return this.mode === DialogMode.New;
  }

  constructor(
    private readonly purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
  }

  private mapPurchaseToForm() {
    this.form.patchValue({
      id: this.purchase.id,
      description: this.purchase.description,
      sellerName: this.purchase.seller?.name,
      sellerUrl: this.purchase.seller?.url,
      //materialId: this.purchase.materialId,
      quantity: this.purchase.quantity,
      totalPrice: this.purchase.totalPrice,
      priceCalculation: this.purchase.priceCalculation,
      date: this.purchase.date,
    });
  }

  private mapFormToPurchase() {
    this.purchase.id = this.form.get('id')?.value || '';
    this.purchase.description = this.form.get('description')?.value || '';
    this.purchase.seller = {
      name: this.form.get('sellerName')?.value || '',
      url: this.form.get('sellerUrl')?.value || '',
    };
    //this.purchase.materialId = this.form.get('materialId')?.value || '';
    this.purchase.quantity = this.form.get('quantity')?.value || 0;
    this.purchase.totalPrice = this.form.get('totalPrice')?.value || 0;
    this.purchase.priceCalculation = this.form.get('priceCalculation')?.value || 'u';
    this.purchase.date = this.form.get('date')?.value || new Date();
  }

  async open(mode?: DialogMode, purchase?: IPurchase, materialId?: string) {
    this.mode = mode || DialogMode.New;
    this.form.reset();
    this.purchase = purchase || {} as IPurchaseInput;
    //this.purchase.materialId = materialId || this.purchase.materialId;
    this.mapPurchaseToForm();
    return this.modal?.open(mode, {
      centered: true,
      size: DialogSize.xl
    });
  }

  save() {
    this.mapFormToPurchase();
    if (this.isEditAction && this.purchase.id) {
      this.purchaseService.updateById(this.purchase.id, this.purchase as IPurchase);
    } else if (this.isNewAction) {
      this.purchaseService.createOne(this.purchase as IPurchase);
    }
    this.modal.close(this.purchase);
  }
}
