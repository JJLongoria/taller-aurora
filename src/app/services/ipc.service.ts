import { Injectable } from '@angular/core';
import { IpcRenderer } from "electron";

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private ipc: IpcRenderer | undefined;

  constructor() {
    if (window.require) {
      try {
        this.ipc = window.require("electron").ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn("Electron IPC was not loaded");
    }
  }

  invoke(channel: string, ...args: any[]){
    if(!this.ipc){
      return new Promise((resolve) => {
        resolve(undefined)
      });
    }
    return this.ipc.invoke(channel, ...args);
  }

  send(channel: string, ...args: any[]){
    if(!this.ipc){
      return;
    }
    this.ipc.send(channel, ...args);
  }

  sendSync(channel: string, ...args: any[]){
    if(!this.ipc){
      return;
    }
    return this.ipc.sendSync(channel, ...args);
  }

  on(channel: string, listener: any){
    if(!this.ipc){
      return;
    }
    this.ipc.on(channel, listener);
  }

  once(channel: string, listener: any){
    if(!this.ipc){
      return;
    }
    this.ipc.once(channel, listener);
  }

  addListener(name: string, listener: any){
    if(!this.ipc){
      return;
    }
    this.ipc.addListener(name, listener);
  }

  removeListener(name: string, listener: any){
    if(!this.ipc){
      return;
    }
    this.ipc.removeListener(name, listener);
  }

  removeAllListeners(name: string){
    if(!this.ipc){
      return;
    }
    this.ipc.removeAllListeners(name);
  }



  
}
