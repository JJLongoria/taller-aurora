import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @ViewChild('notificationModal') notificationModal?: NotificationModalComponent;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.notificationService.setModal(this.notificationModal);
    }, 500);
  }

}
