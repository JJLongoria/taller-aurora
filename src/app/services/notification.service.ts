import { Injectable } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AlertDialog, ConfirmDialog, NotificationModalComponent } from '../components/notification-modal/notification-modal.component';

export interface Toast {
  header: string;
  message?: string;
  delay?: number;
  link?: {
    text: string;
    url?: string;
    useRouter?: boolean;
    actionLink?: boolean;
    action?: any;
    data?: any;
  }
}

interface ToastInfo {
  header: string;
  message?: string;
  classname?: string;
  type: 'info' | 'success' | 'warning' | 'validation' | 'error';
  delay?: number;
  link?: {
    text: string;
    url?: string;
    useRouter?: boolean;
    actionLink?: boolean;
    action?: any;
    data?: any;
  }
}



@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private static DEFAULT_DELAY = 5000;

  modal?: NotificationModalComponent;
  toasts: ToastInfo[] = [];

  constructor() {

   }

  setModal(modal?: NotificationModalComponent) {
    this.modal = modal;
  }

  info(toast: Toast) {
    this.show({
      header: toast.header,
      message: toast.message,
      type: 'info',
      classname: 'bg-info text-light',
      delay: toast.delay || NotificationService.DEFAULT_DELAY,
      link: toast.link
    });
  }

  success(toast: Toast) {
    this.show({
      header: toast.header,
      message: toast.message,
      type: 'success',
      classname: 'bg-success text-light',
      delay: toast.delay || NotificationService.DEFAULT_DELAY,
      link: toast.link
    });
  }

  validation(toast: Toast) {
    this.show({
      header: toast.header,
      message: toast.message,
      type: 'validation',
      classname: 'bg-light text-dark',
      delay: toast.delay || NotificationService.DEFAULT_DELAY,
      link: toast.link
    });
  }

  warning(toast: Toast) {
    this.show({
      header: toast.header,
      message: toast.message,
      type: 'warning',
      classname: 'bg-warning text-dark',
      delay: toast.delay || NotificationService.DEFAULT_DELAY,
      link: toast.link
    });
  }

  error(toast: Toast) {
    this.show({
      header: toast.header,
      message: toast.message,
      type: 'error',
      classname: 'bg-danger text-white',
      delay: toast.delay || NotificationService.DEFAULT_DELAY,
      link: toast.link
    });
  }

  alert(dialog: AlertDialog) {
    return this.modal?.openAlert(dialog);
  }

  confirm(dialog: ConfirmDialog) {
    return this.modal?.openConfirm(dialog);
  }

  closeDialog() {
    this.modal?.dismiss();
  }

  private show(toast: ToastInfo) {
    this.toasts.push(toast);
  }

  public remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => { t !== toast });
  }

  public clear(toast: ToastInfo) {
    this.toasts = [];
  }
}
