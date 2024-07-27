import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent extends InputComponent implements OnInit {

  @Input() placeholder: string = '';
  @Input() floatingLabel: boolean = false;
  @Input() messageWhenValueIsMissing?: string;
  @Input() messageWhenWrongMinLengthValue?: string;
  @Input() messageWhenWrongMaxLengthValue?: string;
  @Input() messageWhenWrongPattern?: string;
  @Input() override control!: FormControl<string | null>;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
