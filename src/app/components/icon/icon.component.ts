import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {

  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() set name(value: string | undefined) {
    this.loading = true;
    this._name = value;
    this.loading = false;
  }
  get name(): string | undefined {
    return this._name;
  }
  @Input() set src(value: string | undefined) {
    this.loading = true;
    this._src = value;
    this.loading = false;
  }
  get src(): string | undefined {
    return this._src;
  }
  get path(): string | undefined{
    return this.src ? `./assets/img/icons/${this.src}` : undefined;
  }
  @Input() className: string = '';
  @Input() style: string = '';
  @Input() height: number = 24;
  @Input() alt: string = '';

  loading: boolean = false;
  _name?: string;
  _src?: string;

  constructor() { }

  ngOnInit(): void {
    
  }

  handleClick(){
    this.onClick.emit();
  }

}
