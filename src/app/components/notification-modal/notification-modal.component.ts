import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/base/modal/modal.component';

export interface AlertDialog {
  title: string;
  message: string;
  icon?: string;
  danger: boolean;
  acceptLabel: string,
}

export interface ConfirmDialog {
  title: string;
  message: string;
  icon?: string;
  danger: boolean;
  acceptLabel: string,
  cancelLabel: string;
}

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent;
  message!: string;
  isDanger: boolean = false;
  icon?: string;
  acceptLabel!: string;
  cancelLabel?: string;
  isAlert: boolean = true;
  buttonType?: 'primary' | 'danger' = 'primary';

  constructor() {

  }

  ngOnInit(): void {
    this.buttonType = !this.isDanger ? 'primary' : 'danger';
  }

  openAlert(dialog: AlertDialog) {
    this.modal.title = dialog.title;
    this.message = dialog.message;
    this.icon = dialog.icon;
    this.acceptLabel = dialog.acceptLabel;
    this.isDanger = dialog.danger;
    this.isAlert = true;
    this.buttonType = !this.isDanger ? 'primary' : 'danger';
    return this.modal?.open(undefined, { centered: true });
  }

  openConfirm(dialog: ConfirmDialog) {
    this.modal.title = dialog.title;
    this.message = dialog.message;
    this.icon = dialog.icon;
    this.acceptLabel = dialog.acceptLabel;
    this.cancelLabel = dialog.cancelLabel ? dialog.cancelLabel : '';
    this.isDanger = dialog.danger;
    this.isAlert = false;
    this.buttonType = !this.isDanger ? 'primary' : 'danger';
    return this.modal?.open(undefined, { centered: true });
  }

  dismiss() {
    this.modal.dismiss();
  }

}
