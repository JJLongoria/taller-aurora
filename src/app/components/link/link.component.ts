import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  @Input() href?: string;
  @Input() type?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'light' = 'primary';
  @Input() params?: { [key: string]: string };

  get link() {
    let linkTmp = this.href ? this.href : '#';
    if (linkTmp && this.params) {
      for (const key in this.params) {
        linkTmp = linkTmp.replace(':' + key, this.params[key]);
      }
    }
    return linkTmp;
  }

  constructor() { }

  ngOnInit(): void {
  }

  click(event: any): void {
    this.onClick.emit(event);
  }

}
