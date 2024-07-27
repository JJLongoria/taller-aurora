import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { IOrder } from 'src/libs/types/order.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService implements Service<IOrder> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: IOrder[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(private readonly ipcService: IpcService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadOrders').then((result) => {
      if (result) {
        this.data = result as IOrder[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('saveOrders', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): IOrder[] {
    return this.data;
  }

  find(query: { [key: string]: any}): IOrder[] {
    return this.data.filter((element: IOrder) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof IOrder];
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

  findById(id: string): IOrder {
    return this.data.find((element: IOrder) => element.id === id) as IOrder;
  }

  create(data: IOrder[]): IOrder[] {
    let numberId = 0;
    this.data.forEach((element: IOrder) => {
      if (element.number > numberId) {
        numberId = element.number;
      }
    });
    data.forEach((element: IOrder) => {
      element.id = CoreUtils.createUUID();
      element.number = ++numberId;
      element.name = StrUtils.formatTemplate(element.number, 'E-{00000000}');
      this.data.push(element);
    });
    this.save();
    return data;
  }

  createOne(data: IOrder): IOrder {
    let numberId = 0;
    this.data.forEach((element: IOrder) => {
      if (element.number > numberId) {
        numberId = element.number;
      }
    });
    data.id = CoreUtils.createUUID();
    data.number = ++numberId;
    data.name = StrUtils.formatTemplate(data.number, 'E-{00000000}');
    data.id = CoreUtils.createUUID();
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: IOrder[]): IOrder[] {
    data.forEach((element: IOrder) => {
      const index = this.data.findIndex((c: IOrder) => c.id === element.id);
      this.data[index] = element;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: IOrder): IOrder {
    const index = this.data.findIndex((element: IOrder) => element.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  delete(data: IOrder[]): IOrder[] {
    data.forEach((element: IOrder) => {
      const index = this.data.findIndex((c: IOrder) => c.id === element.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): IOrder {
    const index = this.data.findIndex((element: IOrder) => element.id === id);
    const element = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return element;
  }
}
