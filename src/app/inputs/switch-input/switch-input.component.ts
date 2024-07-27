import { Component, OnInit } from '@angular/core';
import { CheckInputComponent } from '../check-input/check-input.component';

@Component({
  selector: 'app-switch-input',
  templateUrl: './switch-input.component.html',
  styleUrls: ['./switch-input.component.css']
})
export class SwitchInputComponent extends CheckInputComponent implements OnInit {

  constructor() {
    super();
   }

}
