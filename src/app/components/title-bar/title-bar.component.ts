import { Component, OnInit } from '@angular/core';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {

  maximized = false;
  title = 'El Taller de Aurora - Gestión e Inventario';

  constructor(private ipcService: IpcService) { }

  ngOnInit(): void {
  }

  minimize(event: Event): void {
    this.ipcService.invoke('minimize');
  }

  maximize(event: Event): void {
    this.ipcService.invoke('maximize').then(() => {
      this.maximized = true;
    });
  }

  restore(event: Event): void {
    this.ipcService.invoke('restore').then(() => {
      this.maximized = false;
    });;
  }

  close(event: Event) {
    this.ipcService.invoke('close');
  }

}
