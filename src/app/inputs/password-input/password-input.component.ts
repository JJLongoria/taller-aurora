import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';
import { TextInputComponent } from '../text-input/text-input.component';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css']
})
export class PasswordInputComponent extends TextInputComponent implements OnInit {

  constructor() {
    super();
  }

}
