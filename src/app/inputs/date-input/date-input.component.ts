import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent extends InputComponent implements OnInit {

  @Input() placeholder: string = '';
  @Input() floatingLabel: boolean = false;
  @Input() min?: Date;
  @Input() max?: Date;
  @Input() messageWhenValueIsMissing?: string;
  @Input() messageWhenWrongMinValue?: string;
  @Input() messageWhenWrongMaxValue?: string;
  @Input() override control!: FormControl<Date | string | null>;

  constructor() { 
    super();
  }

  ngOnInit(): void {
  }

}
