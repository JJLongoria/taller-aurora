import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { IMaterial } from 'src/libs/types/material.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService implements Service<IMaterial> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: IMaterial[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(private readonly ipcService: IpcService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadMaterials').then((result) => {
      if (result) {
        this.data = result as IMaterial[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('saveMaterials', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): IMaterial[] {
    return this.data;
  }

  find(query: { [key: string]: any}): IMaterial[] {
    return this.data.filter((element: IMaterial) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof IMaterial];
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

  findById(id: string): IMaterial {
    return this.data.find((category: IMaterial) => category.id === id) as IMaterial;
  }

  create(data: IMaterial[]): IMaterial[] {
    data.forEach((category: IMaterial) => {
      category.id = CoreUtils.createUUID();
      this.data.push(category);
    });
    this.save();
    return data;
  }

  createOne(data: IMaterial): IMaterial {
    data.id = CoreUtils.createUUID();
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: IMaterial[]): IMaterial[] {
    data.forEach((category: IMaterial) => {
      const index = this.data.findIndex((c: IMaterial) => c.id === category.id);
      this.data[index] = category;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: IMaterial): IMaterial {
    const index = this.data.findIndex((category: IMaterial) => category.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  delete(data: IMaterial[]): IMaterial[] {
    data.forEach((category: IMaterial) => {
      const index = this.data.findIndex((c: IMaterial) => c.id === category.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): IMaterial {
    const index = this.data.findIndex((category: IMaterial) => category.id === id);
    const category = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return category;
  }
}
