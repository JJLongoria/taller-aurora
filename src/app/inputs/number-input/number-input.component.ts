import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css']
})
export class NumberInputComponent extends InputComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() floatingLabel: boolean = false;
  @Input() min: number = Number.MIN_VALUE;
  @Input() max: number = Number.MAX_VALUE;
  @Input() messageWhenValueIsMissing?: string;
  @Input() messageWhenWrongMinValue?: string;
  @Input() messageWhenWrongMaxValue?: string;
  @Input() override control!: FormControl<Number | null>;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
