import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { SelectItem } from 'src/app/inputs/select-input/select-input.component';
import { MathUtils } from 'src/libs/utils/math.utils';
import { StrUtils } from 'src/libs/utils/str.utils';

const SCALES = {
  g: {
    mg: {
      label: 'Miligramos',
      multiplier: 0.001,
    },
    cg: {
      label: 'Centigramos',
      multiplier: 0.01,
    },
    dg: {
      label: 'Decigramos',
      multiplier: 0.1,
    },
    g: {
      label: 'Gramos',
      multiplier: 1,
    },
    dag: {
      label: 'Decagramos',
      multiplier: 10,
    },
    hg: {
      label: 'Hectogramos',
      multiplier: 100,
    },
    kg: {
      label: 'Kilogramos',
      multiplier: 1000,
    },
  },
  l: {
    ml: {
      label: 'Mililitros',
      multiplier: 0.001,
    },
    cl: {
      label: 'Centilitros',
      multiplier: 0.01,
    },
    dl: {
      label: 'Decilitros',
      multiplier: 0.1,
    },
    l: {
      label: 'Litros',
      multiplier: 1,
    },
  },
  m: {
    mm: {
      label: 'Milimetros',
      multiplier: 0.001,
    },
    cm: {
      label: 'Centimetros',
      multiplier: 0.01,
    },
    dm: {
      label: 'Decimetros',
      multiplier: 0.1,
    },
    m: {
      label: 'Metros',
      multiplier: 1,
    },
    dam: {
      label: 'Decametros',
      multiplier: 10,
    },
    hm: {
      label: 'Hectometros',
      multiplier: 100,
    },
    km: {
      label: 'Kilometros',
      multiplier: 1000,
    },
  },
  m2: {
    mm2: {
      label: 'Milimetros Cuadrados',
      multiplier: 0.000001,
    },
    cm2: {
      label: 'Centimetros Cuadrados',
      multiplier: 0.0001,
    },
    dm2: {
      label: 'Decimetros Cuadrados',
      multiplier: 0.01,
    },
    m2: {
      label: 'Metros Cuadrados',
      multiplier: 1,
    },
  },
}

@Component({
  selector: 'app-price-calculator-modal',
  templateUrl: './price-calculator-modal.component.html',
  styleUrls: ['./price-calculator-modal.component.css']
})
export class PriceCalculatorModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent
  mode: DialogMode = DialogMode.View;
  form = new FormGroup({
    priceCalculation: new FormControl<'g' | 'g/u' | 'l' | 'l/u' | 'u' | 'm' | 'm/u' | 'm2' | 'm2/u' | null>('g'),
    scale: new FormControl<string | null>(null),
    quantity: new FormControl<number | null>(null, [Validators.required]),
    units: new FormControl<number | null>(null),
    price: new FormControl<number | null>(null, [Validators.required]),
  });
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
  scaleOptions?: SelectItem[];
  showUnits = false;
  quantityLabel = 'Cantidad';
  scale: any;
  relativePrice: number | null = null;
  unitPrice: string | null = null;
  priceCalculation?: string | 'g' | 'l' | 'u' | 'm' | 'm2' | null = null;

  get isViewAction() {
    return this.mode === DialogMode.View;
  }

  get isEditAction() {
    return this.mode === DialogMode.Edit;
  }

  get isNewAction() {
    return this.mode === DialogMode.New;
  }
  constructor() { }

  ngOnInit(): void {
    this.form.controls.priceCalculation.valueChanges.subscribe((value) => {
      this.showUnits = value?.[0].includes('/u') || false;
      if (this.showUnits) {
        this.quantityLabel = 'Cantidad/Unidades';
      } else {
        this.quantityLabel = 'Cantidad';
      }
      if (value?.[0]) {
        const val = value?.[0].replace('/u', '');
        const scale = SCALES[val as keyof typeof SCALES];
        if (scale) {
          this.scale = scale;
          this.scaleOptions = Object.entries(scale).map(([key, value]) => ({ value: key, label: value.label }));
          this.form.controls.scale.setValue(Object.keys(scale)[0]);
        } else {
          this.scale = undefined;
          this.scaleOptions = undefined;
        }
      }
      this.calculateRelativePrice();
    });
    this.form.controls.scale.valueChanges.subscribe((value) => {
      if (value) {
        const scale = this.scale[value];
        if (this.showUnits) {
          this.quantityLabel = scale.label;
        } else {
          this.quantityLabel = scale.label;
        }
      } else {
        this.quantityLabel = 'Cantidad';
        this.form.controls.quantity.setValue(null);
        this.form.controls.units.setValue(null);
      }
      this.calculateRelativePrice();
    });
    this.form.controls.price.valueChanges.subscribe((value) => {
      this.calculateRelativePrice();
    });
    this.form.controls.quantity.valueChanges.subscribe((value) => {
      this.calculateRelativePrice();
    });
    this.form.controls.units.valueChanges.subscribe((value) => {
      this.calculateRelativePrice();
    });
  }

  async open(priceType: 'g' | 'l' | 'u' | 'm' | 'm2' | null = 'u') {
    this.form.reset();
    this.form.patchValue({
      priceCalculation: priceType
    });
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.xl
    });
  }

  private calculateRelativePrice() {
    const selectedScale = this.form.controls.scale.value;
    const scaleData = this.scale && selectedScale && this.scale[selectedScale] ? this.scale[selectedScale] : undefined;
    const multiplier = scaleData ? scaleData.multiplier : 1;
    const price = this.form.controls.price.value;
    const quantity = (this.form.controls.quantity.value || 0);
    const quantityMultiplied = quantity * multiplier;
    const units = this.form.controls.units.value;
    this.priceCalculation = this.form.controls.priceCalculation.value?.[0].replace('/u', '');
    this.unitPrice = this.priceCalculationOptions.find((item) => item.value === this.priceCalculation)?.label || null;
    this.unitPrice = this.unitPrice ? StrUtils.replace(this.unitPrice, 's', '') : null;
    if (price && quantityMultiplied && units) {
      this.relativePrice = MathUtils.round(price / (quantityMultiplied * units), 2);
    } else if (price && quantityMultiplied) {
      this.relativePrice = MathUtils.round(price / quantityMultiplied, 2);
    } else {
      this.relativePrice = null;
    }
  }

  save() {
    this.modal.close({
      priceCalculation: this.priceCalculation,
      scale: this.form.controls.scale.value,
      quantity: this.form.controls.quantity.value,
      units: this.form.controls.units.value,
      price: this.form.controls.price.value,
      relativePrice: this.relativePrice,
    });
  }

}
