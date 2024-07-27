import { ThisReceiver } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { read } from '@popperjs/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Input() label?: string | null;
  @Input() name!: string;
  @Input() required: boolean = false;
  @Input() control: FormControl<any> = new FormControl<any>(null);
  @Input() style: string = '';
  @Input() className: string = '';
  @Input() help?: string;
  @Input() set value(value: any) {
    this._value = value;
    this.control.setValue(value);
  }
  get value() {
    return this.control.value || this._value;
  }
  @Input() set readonly(value: boolean | null) {
    this._readonly = value || false;
    if (this._readonly) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }
  get readonly(): boolean {
    return this._readonly;
  }
  @Input() set disabled(value: boolean | null) {
    this._disabled = value || false;
    if (this._disabled) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }

  get isRequired() {
    return this.required || this.control?.hasValidator(Validators.required);
  }

  private _disabled: boolean = false;
  private _readonly: boolean = false;
  private _value: any;

  constructor() { }


}
