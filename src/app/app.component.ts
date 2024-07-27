import { Component } from '@angular/core';
import { IpcService } from "./services/ipc.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Epoxy';
  menuElement = 'home';
  constructor(
    private ipcService: IpcService,

  ) {

  }

}
