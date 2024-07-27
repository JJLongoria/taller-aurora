import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { ICategory } from 'src/libs/types/category.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements Service<ICategory> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: ICategory[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(private readonly ipcService: IpcService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadCategories').then((result) => {
      if (result) {
        this.data = result as ICategory[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('saveCategories', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): ICategory[] {
    return this.data;
  }

  find(query: { [key: string]: any}): ICategory[] {
    return this.data.filter((element: ICategory) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof ICategory];
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

  findById(id: string): ICategory {
    return this.data.find((category: ICategory) => category.id === id) as ICategory;
  }

  create(data: ICategory[]): ICategory[] {
    data.forEach((category: ICategory) => {
      category.id = CoreUtils.createUUID();
      this.data.push(category);
    });
    this.save();
    return data;
  }

  createOne(data: ICategory): ICategory {
    data.id = CoreUtils.createUUID();
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: ICategory[]): ICategory[] {
    data.forEach((category: ICategory) => {
      const index = this.data.findIndex((c: ICategory) => c.id === category.id);
      this.data[index] = category;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: ICategory): ICategory {
    const index = this.data.findIndex((category: ICategory) => category.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  delete(data: ICategory[]): ICategory[] {
    data.forEach((category: ICategory) => {
      const index = this.data.findIndex((c: ICategory) => c.id === category.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): ICategory {
    const index = this.data.findIndex((category: ICategory) => category.id === id);
    const category = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return category;
  }
}
