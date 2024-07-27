import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { IPurchase } from 'src/libs/types/purchase.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService implements Service<IPurchase> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: IPurchase[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(private readonly ipcService: IpcService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadPurchases').then((result) => {
      if (result) {
        this.data = result as IPurchase[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('savePurchases', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): IPurchase[] {
    return this.data;
  }

  find(query: { [key: string]: any}): IPurchase[] {
    return this.data.filter((element: IPurchase) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof IPurchase];
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

  findById(id: string): IPurchase {
    return this.data.find((element: IPurchase) => element.id === id) as IPurchase;
  }

  create(data: IPurchase[]): IPurchase[] {
    let numberId = 0;
    this.data.forEach((element: IPurchase) => {
      if (element.number > numberId) {
        numberId = element.number;
      }
    });
    data.forEach((element: IPurchase) => {
      element.id = CoreUtils.createUUID();
      element.number = ++numberId;
      element.name = StrUtils.formatTemplate(element.number, 'C-{00000000}');
      this.data.push(element);
    });
    this.save();
    return data;
  }

  createOne(data: IPurchase): IPurchase {
    let numberId = 0;
    this.data.forEach((element: IPurchase) => {
      if (element.number > numberId) {
        numberId = element.number;
      }
    });
    data.id = CoreUtils.createUUID();
    data.number = ++numberId;
    data.name = StrUtils.formatTemplate(data.number, 'C-{00000000}');
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: IPurchase[]): IPurchase[] {
    data.forEach((element: IPurchase) => {
      const index = this.data.findIndex((c: IPurchase) => c.id === element.id);
      this.data[index] = element;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: IPurchase): IPurchase {
    const index = this.data.findIndex((element: IPurchase) => element.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  delete(data: IPurchase[]): IPurchase[] {
    data.forEach((element: IPurchase) => {
      const index = this.data.findIndex((c: IPurchase) => c.id === element.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): IPurchase {
    const index = this.data.findIndex((element: IPurchase) => element.id === id);
    const element = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return element;
  }
}
