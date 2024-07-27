import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor(private icpService: IpcService) {

  }

  async readFile(path: string): Promise<string> {
    return await this.icpService.invoke('readFile', path) as string;
  }

  async writeFile(path: string, content: string) {
    return await this.icpService.invoke('writeFile', path, content);
  }

  async isExists(path: string): Promise<boolean> {
    return await this.icpService.invoke('isExists', path) as boolean;
  }


}
