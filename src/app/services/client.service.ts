import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { IClient } from 'src/libs/types/client.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService implements Service<IClient> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: IClient[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(private readonly ipcService: IpcService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadClients').then((result) => {
      if (result) {
        this.data = result as IClient[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('saveClients', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): IClient[] {
    return this.data;
  }

  find(query: { [key: string]: any}): IClient[] {
    return this.data.filter((element: IClient) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof IClient];
        const queryVal = query[key];
        if (evalString)
          evalString += ' && ';
        if (typeof value === 'string' && typeof queryVal === 'string') {
          evalString += StrUtils.containsIgnoreCase(value, queryVal);
        } else {
          evalString += value == queryVal;
        }
      });
      return eval(evalString);
    });
  }

  findById(id: string): IClient {
    return this.data.find((category: IClient) => category.id === id) as IClient;
  }

  create(data: IClient[]): IClient[] {
    data.forEach((category: IClient) => {
      category.id = CoreUtils.createUUID();
      this.data.push(category);
    });
    this.save();
    return data;
  }

  createOne(data: IClient): IClient {
    data.id = CoreUtils.createUUID();
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: IClient[]): IClient[] {
    data.forEach((category: IClient) => {
      const index = this.data.findIndex((c: IClient) => c.id === category.id);
      this.data[index] = category;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: IClient): IClient {
    const index = this.data.findIndex((category: IClient) => category.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  delete(data: IClient[]): IClient[] {
    data.forEach((category: IClient) => {
      const index = this.data.findIndex((c: IClient) => c.id === category.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): IClient {
    const index = this.data.findIndex((category: IClient) => category.id === id);
    const category = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return category;
  }
}