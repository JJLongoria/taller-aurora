import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputComponent } from 'src/app/base/input/input.component';

export interface SelectItem {
  value?: string | null;
  label: string;
}

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css']
})
export class SelectInputComponent extends InputComponent implements OnInit, OnDestroy {

  @Input() multiple: boolean = false;
  @Input() floatingLabel: boolean = false;
  @Input() valueField: string = 'value';
  @Input() labelField: string = 'label';
  @Input() firstValueLabel?: string;
  @Input() size: number = 0;
  @Input() messageWhenValueIsMissing?: string;
  @Input() override control!: FormControl<string | string[] | null>;
  @Input() set values(values: any[]) {
    this._values = values;
    this.prepareValues();
  }
  get values() {
    return this._values;
  }
  @Input() override set readonly(value: boolean) {
    super.readonly = value;
    if (value) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }

  private _values: any[] = [];
  items: SelectItem[] = [];
  subscription?: Subscription;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.prepareValues();
    /*this.subscription = this.control.valueChanges.subscribe((value) => {
      if (!this.multiple && value) {
        this.control.setValue(value[0], {
          emitEvent: false,
        });
      }
    });*/
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private prepareValues() {
    this.items = [];
    if (this.firstValueLabel) {
      this.items.push({
        value: null,
        label: this.firstValueLabel,
      });
      if (!this.control.value) {
        this.control.setValue(null);
      }
    }
    for (const value of this._values) {
      const val = value[this.valueField];
      this.items.push({
        value: val,
        label: value[this.labelField],
      });
    }
    if (!this.control.value) {
      this.control.setValue(this._values[0]?.value);
    }
  }
}
