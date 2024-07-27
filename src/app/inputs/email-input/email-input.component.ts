import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.css']
})
export class EmailInputComponent extends TextInputComponent implements OnInit {

  constructor() {
    super();
  }

}
