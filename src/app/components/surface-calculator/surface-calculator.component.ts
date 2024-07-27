import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';

@Component({
  selector: 'app-surface-calculator',
  templateUrl: './surface-calculator.component.html',
  styleUrls: ['./surface-calculator.component.css']
})
export class SurfaceCalculatorComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent
  mode: DialogMode = DialogMode.View;
  form = new FormGroup({
    length: new FormControl<number>(0, [Validators.required, Validators.min(0.001)]),
    width: new FormControl<number>(0, [Validators.required, Validators.min(0.001)]),
  });
  magnitude?: string;

  constructor() { }

  ngOnInit(): void {
  }

  async open(magnitude?: string) {
    this.magnitude = magnitude;
    this.form.reset();
    return this.modal?.open(this.mode, {
      centered: true,
      size: DialogSize.xl
    });
  }

  save() {
    this.modal.close((this.form.value.length || 0) * (this.form.value.width || 0));
  }

}
