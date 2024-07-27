import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { SelectItem } from '../select-input/select-input.component';

@Component({
  selector: 'app-free-select-input',
  templateUrl: './free-select-input.component.html',
  styleUrls: ['./free-select-input.component.css']
})
export class FreeSelectInputComponent extends InputComponent implements OnInit {

  @Input() sourceLabel: string = '';
  @Input() targetLabel: string = '';
  @Input() size: number = 5;
  @Input() sort: boolean = true;
  @Input() min?: number | null;
  @Input() max?: number | null;
  @Input() valueField: string = 'value';
  @Input() labelField: string = 'label';
  @Input() messageWhenValueIsMissing?: string;
  @Input() messageWhenMaxLimitReached?: string;
  @Input() messageWhenWrognMinLimit?: string;
  @Input() override control!: FormControl<string | string[] | null>;

  sourceControl: FormControl<string | null> = new FormControl<string | null>(null);
  targetControl: FormControl<string[] | null> = new FormControl<string[] | null>([]);

  private _values: any[] = [];
  selectedItems: SelectItem[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  add() {
    if (this.hasSourceValues()) {
      const selected = [...this.selectedItems];
      selected.push({
        value: this.sourceControl.value,
        label: this.sourceControl.value || '',
      });
      this.selectedItems = selected;
      this.sortTargetValues();
      this.setSelectedValues();
      this.sourceControl.setValue(null);
      this.targetControl.setValue([]);
      this.validateControl();
    }
  }

  remove() {
    if (this.hasTargetValues()) {
      this.selectedItems = this.selectedItems.filter((element) => { return this.targetControl.value !== element.value });
      this.sortTargetValues();
      this.setSelectedValues();
      this.targetControl.setValue([]);
      this.validateControl();
    }
  }

  removeAll() {
    if (this.hasSelectedItems()) {
      this.selectedItems = [];
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

  private hasSourceValues() {
    return this.sourceControl.value && this.sourceControl.value.length > 0;
  }

  private hasSelectedItems() {
    return this.selectedItems && this.selectedItems.length > 0;
  }

  private hasTargetValues() {
    return this.targetControl.value && this.targetControl.value.length > 0;
  }

  private sortTargetValues() {
    if (this.sort) {
      this.selectedItems = CoreUtils.sort(this.selectedItems, ['label'], false);
    }
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

}
