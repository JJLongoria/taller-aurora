import { Component, OnInit } from '@angular/core';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private ipcService: IpcService
  ) {

  }

  ngOnInit(): void {
  }

  onClickMenu(value: string) {

  }

}
