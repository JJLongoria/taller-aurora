import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { ISale } from 'src/libs/types/sale.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService implements Service<ISale> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: ISale[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(private readonly ipcService: IpcService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadSales').then((result) => {
      if (result) {
        this.data = result as ISale[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('saveSales', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): ISale[] {
    return this.data;
  }

  find(query: { [key: string]: any}): ISale[] {
    return this.data.filter((element: ISale) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof ISale];
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

  findById(id: string): ISale {
    return this.data.find((element: ISale) => element.id === id) as ISale;
  }

  create(data: ISale[]): ISale[] {
    let numberId = 0;
    this.data.forEach((element: ISale) => {
      if (element.number > numberId) {
        numberId = element.number;
      }
    });
    data.forEach((element: ISale) => {
      element.id = CoreUtils.createUUID();
      element.number = ++numberId;
      element.name = StrUtils.formatTemplate(element.number, 'V-{00000000}');
      this.data.push(element);
    });
    this.save();
    return data;
  }

  createOne(data: ISale): ISale {
    let numberId = 0;
    this.data.forEach((element: ISale) => {
      if (element.number > numberId) {
        numberId = element.number;
      }
    });
    data.id = CoreUtils.createUUID();
    data.number = ++numberId;
    data.name = StrUtils.formatTemplate(data.number, 'V-{00000000}');
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: ISale[]): ISale[] {
    data.forEach((element: ISale) => {
      const index = this.data.findIndex((c: ISale) => c.id === element.id);
      this.data[index] = element;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: ISale): ISale {
    const index = this.data.findIndex((element: ISale) => element.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  delete(data: ISale[]): ISale[] {
    data.forEach((element: ISale) => {
      const index = this.data.findIndex((c: ISale) => c.id === element.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): ISale {
    const index = this.data.findIndex((element: ISale) => element.id === id);
    const element = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return element;
  }
}
