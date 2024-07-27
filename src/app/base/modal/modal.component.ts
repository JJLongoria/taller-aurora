import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export const DialogSize = {
  xl: 'xl',
  lg: 'lg',
  sm: 'sm',
}

export enum DialogMode {
  New,
  View,
  PartialView,
  Edit,
  PartialEdit,
  Delete
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  private opened: Boolean = false;
  protected mode: DialogMode = DialogMode.View;
  @Input() title: string = '';
  @ViewChild('modal') protected modalContent?: TemplateRef<ModalComponent>;
  private modalRef?: NgbModalRef;
  @Output() beforeDismiss: EventEmitter<any> = new EventEmitter();
  @Output() beforeClose: EventEmitter<any> = new EventEmitter();

  constructor(private readonly ngbModal: NgbModal, private readonly config: NgbModalConfig) {
    this.config.backdrop = 'static';
    this.config.keyboard = false;
  }

  ngOnInit(): void {
  }

  setTitle(title: string) {
    this.title = title;
  }

  open(mode?: DialogMode, options?: NgbModalOptions) {
    if (!options) {
      options = {};
    }
    options.scrollable = true;
    this.mode = mode || DialogMode.View;
    this.opened = true;
    this.modalRef = this.ngbModal?.open(this.modalContent, options);
    return this.modalRef?.result;
  }

  close(data?: any) {
    if (this.modalRef) {
      this.beforeClose.emit();
      this.modalRef.close(data);
      this.opened = false;
    }
  }

  dismiss() {
    if (this.modalRef) {
      this.beforeDismiss.emit();
      this.modalRef.dismiss();
      this.opened = false;
    }
  }

  isOpen() {
    return this.opened;
  }

}
