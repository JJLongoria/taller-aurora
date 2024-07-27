import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() text?: string;
  @Input() type?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' = 'primary';
  @Input() size?: 'small' | 'medium' | 'large' = 'medium';
  @Input() outline?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() icon?: string;
  @Input() srcIcon?: string;
  @Input() iconPosition?: 'left' | 'right' = 'left';
  @Input() class?: string;
  @Input() iconSize: number = 24;
  @Input() className: string = '';
  @Input() style: string = '';
  @Input() asLink: boolean = false;
  @Input() href: string = '#';

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  get styleClass() {
    let cls = 'btn-';
    if (this.outline) {
      cls += 'outline-';
    }
    cls += this.type;
    if (this.size === 'small') {
      this.iconSize = 16;
      cls += ' btn-sm';
    } else if (this.size === 'large') {
      this.iconSize = 32;
      cls += ' btn-lg';
    }
    cls += ' ' + this.className;
    if(this.asLink && this.disabled){
      cls += ' disabled';
    }
    return cls;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onclick(event: any) {
    if (this.disabled) {
      return;
    }
    this.onClick.emit(event);
  }

}
