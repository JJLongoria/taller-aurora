import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() message?: string;
  @Input() type: 'dots-a' | 'dots-b' | 'dots-c' | 'bars' | 'circle-a' | 'circle-b' | 'circle-c' = 'dots-a';
  @Input() size: number = 24;
  @Input() fullScreen: boolean = false;

  rowClass(){
    return this.fullScreen ? 'h-100 w-100 justify-content-center align-items-center' : '';
  }

  spinnerStyle(){
    return `font-size:${this.size}px`;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
