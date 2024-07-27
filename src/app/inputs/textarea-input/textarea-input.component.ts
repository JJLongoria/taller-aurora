import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.css']
})
export class TextareaInputComponent extends TextInputComponent implements OnInit {

  @Input() rows: number = 5;

  constructor() {
    super();
  }

}
