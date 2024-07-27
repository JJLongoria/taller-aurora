import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from 'src/app/base/input/input.component';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css']
})
export class FileInputComponent extends InputComponent implements OnInit {

  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeholder: string = '';
  @Input() floatingLabel: boolean = false;
  @Input() multiple: boolean = false;
  @Input() messageWhenValueIsMissing?: string;
  @Input() accept?: string;
  @Input() override control!: FormControl<File[] | null>;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  onchange(event: any) {
    this.control.setValue(event.target.files);
    this.change?.emit(event);
  }

}
