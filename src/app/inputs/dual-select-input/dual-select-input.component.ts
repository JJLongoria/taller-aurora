import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { SelectItem } from '../select-input/select-input.component';

@Component({
  selector: 'app-dual-select-input',
  templateUrl: './dual-select-input.component.html',
  styleUrls: ['./dual-select-input.component.css']
})
export class DualSelectInputComponent extends InputComponent implements OnInit {

  @Input() sourceLabel: string = '';
  @Input() targetLabel: string = '';
  @Input() valueField: string = 'value';
  @Input() labelField: string = 'label';
  @Input() size: number = 5;
  @Input() sort: boolean = true;
  @Input() sortField: 'value' | 'label' = 'label';
  @Input() sortTarget: boolean = false;
  @Input() sortTargetField: 'value' | 'label' = 'label';
  @Input() min?: number | null;
  @Input() max?: number | null;
  @Input() messageWhenValueIsMissing?: string;
  @Input() messageWhenMaxLimitReached?: string;
  @Input() messageWhenWrognMinLimit?: string;
  @Input() override control!: FormControl<string | string[] | null>;

  sourceControl: FormControl<string[] | null> = new FormControl<string[] | null>([]);
  targetControl: FormControl<string[] | null> = new FormControl<string[] | null>([]);

  @Input() set values(values: any[]) {
    this._values = values;
    this.items = [];
    this.selectedItems = [];
    for (const value of this._values) {
      const val = value[this.valueField];
      const selected = this.control?.value && Array.isArray(this.control?.value) ? this.control.value.includes(val) : val === this.control?.value;
      if (selected) {
        this.selectedItems.push({
          value: val,
          label: value[this.labelField],
        });
      } else {
        this.items.push({
          value: val,
          label: value[this.labelField],
        });
      }
    }
    this.sortSourceValues();
    this.sortTargetValues();
  }
  get values() {
    return this._values;
  }

  private _values: any[] = [];
  items: SelectItem[] = [];
  selectedItems: SelectItem[] = [];

  constructor() {
    super();

    this.sourceLabel = !this.sourceLabel || this.sourceLabel.length === 0 ? 'Valores Disponibles' : this.sourceLabel;
    this.targetLabel = !this.targetLabel || this.targetLabel.length === 0 ? 'Valores Seleccionados' : this.targetLabel;
  }

  add() {
    if (this.hasSourceValues()) {
      const selected = [...this.selectedItems];
      for (const item of this.items) {
        if (!this.sourceControl.value?.includes(item.value || '')) {
          continue;
        }
        if (this.max && this.selectedItems.length >= this.max) {
          continue;
        }
        selected.push(item);
      }
      this.selectedItems = selected;
      this.items = this.items.filter((element) => { return !this.sourceControl.value?.includes(element.value || '') });
      this.sortSourceValues();
      this.sortTargetValues();
      this.setSelectedValues();
      this.sourceControl.setValue([]);
      this.targetControl.setValue([]);
      this.validateControl();
    }
  }

  remove() {
    if (this.hasTargetValues()) {
      const sourceItems = [...this.items]
      sourceItems.push(...this.selectedItems.filter((element) => { return this.targetControl.value?.includes(element.value || '') }));
      this.items = sourceItems;
      this.selectedItems = this.selectedItems.filter((element) => { return !this.targetControl.value?.includes(element.value || '') });
      this.sortSourceValues();
      this.sortTargetValues();
      this.setSelectedValues();
      this.targetControl.setValue([]);
      this.sourceControl.setValue([]);
      this.validateControl();
    }
  }

  addAll() {
    if (this.hasItems()) {
      const selected = [...this.selectedItems];
      const selectedValues: string[] = [];
      for (const item of this.items) {
        if (this.max && this.selectedItems.length >= this.max) {
          continue;
        }
        selected.push(item);
        selectedValues.push(item.value || '');
      }
      this.selectedItems = selected;
      this.items = this.items.filter((element) => { return !selectedValues.includes(element.value || '') });
      this.sortSourceValues();
      this.sortTargetValues();
      this.setSelectedValues();
      this.sourceControl.setValue([]);
      this.validateControl();
    }
  }

  removeAll() {
    if (this.hasSelectedItems()) {
      this.items = [...this.items, ...this.selectedItems];
      this.selectedItems = [];
      this.sortSourceValues();
      this.sortTargetValues();
      this.setSelectedValues();
      this.targetControl.setValue([]);
      this.validateControl();
    }
  }

  up() {
    if (this.hasTargetValues()) {
      const elementsIndexToMove: number[] = [];
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.targetControl.value?.includes(this.selectedItems[i].value || '')) {
          elementsIndexToMove.push(i);
        }
      }
      let selected = [...this.selectedItems];
      for (const index of elementsIndexToMove) {
        selected = CoreUtils.moveArrayElement(selected, index, index - 1);
      }
      this.selectedItems = selected;
      this.setSelectedValues();
    }
  }

  down() {
    if (this.hasTargetValues()) {
      const elementsIndexToMove: number[] = [];
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.targetControl.value?.includes(this.selectedItems[i].value || '')) {
          elementsIndexToMove.push(i);
        }
      }
      let selected = [...this.selectedItems];
      for (const index of elementsIndexToMove) {
        selected = CoreUtils.moveArrayElement(selected, index, index + 1);
      }
      this.selectedItems = selected;
      this.setSelectedValues();
    }
  }

  private setSelectedValues() {
    this.control.setValue(this.selectedItems.map((element) => { return element.value || '' }));
  }

  private sortSourceValues() {
    if (this.sort) {
      this.items = CoreUtils.sort(this.items, [this.sortField], false);
    }
  }

  private sortTargetValues() {
    if (this.sortTarget) {
      this.selectedItems = CoreUtils.sort(this.selectedItems, [this.sortTargetField], false);
    }
  }

  private hasItems() {
    return this.items && this.items.length > 0;
  }

  private hasSelectedItems() {
    return this.selectedItems && this.selectedItems.length > 0;
  }

  private hasTargetValues() {
    return this.targetControl.value && this.targetControl.value.length > 0;
  }

  private hasSourceValues() {
    return this.sourceControl.value && this.sourceControl.value.length > 0;
  }

  private getTargetValues() {
    return this.targetControl.value || [];
  }

  private getSourceValues() {
    return this.sourceControl.value || [];
  }

  private validateControl() {
    const errors = {
      required: this.required && this.selectedItems.length === 0,
      min: (this.min && this.selectedItems.length < this.min) || false,
      max: (this.max && this.selectedItems.length > this.max) || false,
    };
    const hasErrors = Object.values(errors).some((element) => { return element === true });
    if (hasErrors) {
      this.control.setErrors(errors);
    } else {
      this.control.setErrors(null);
    }
  }

  ngOnInit(): void {

  }

}
