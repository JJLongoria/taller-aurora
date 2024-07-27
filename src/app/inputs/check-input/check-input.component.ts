import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';

@Component({
  selector: 'app-check-input',
  templateUrl: './check-input.component.html',
  styleUrls: ['./check-input.component.css']
})
export class CheckInputComponent extends InputComponent implements OnInit {

  @Input() override control: FormControl<boolean | null> = new FormControl<boolean | null>(null);
  @Input() override set readonly(value: boolean) {
    super.readonly = value;
    if (value) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
