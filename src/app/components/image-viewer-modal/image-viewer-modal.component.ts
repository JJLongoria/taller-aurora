import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';

@Component({
  selector: 'app-image-viewer-modal',
  templateUrl: './image-viewer-modal.component.html',
  styleUrls: ['./image-viewer-modal.component.css']
})
export class ImageViewerModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent;
  imgSrc = '';

  constructor() { }

  ngOnInit(): void {
  }

  open(imgSrc: string) {
    if (!imgSrc.startsWith('file:///')) {
      this.imgSrc = 'file:///' + imgSrc;
    } else {
      this.imgSrc = imgSrc;
    }
    return this.modal?.open(undefined, { centered: true, size: DialogSize.lg });
  }



}
