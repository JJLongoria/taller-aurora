import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.css']
})
export class PillComponent implements OnInit {

  @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();

  @Input() value: any;
  @Input() label: string = '';
  @Input() icon?: string;
  @Input() removable: boolean = false;
  @Input() type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';

  constructor() { }

  ngOnInit(): void {

  }

  onRemoveClick() {
    this.onRemove.emit(this.value);
  }

}
