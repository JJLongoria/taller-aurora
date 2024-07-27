import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { ITool } from 'src/libs/types/tool.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class ToolService implements Service<ITool> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: ITool[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(private readonly ipcService: IpcService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadTools').then((result) => {
      if (result) {
        this.data = result as ITool[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('saveTools', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): ITool[] {
    return this.data;
  }

  find(query: { [key: string]: any}): ITool[] {
    return this.data.filter((element: ITool) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof ITool];
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

  findById(id: string): ITool {
    return this.data.find((category: ITool) => category.id === id) as ITool;
  }

  create(data: ITool[]): ITool[] {
    data.forEach((category: ITool) => {
      category.id = CoreUtils.createUUID();
      this.data.push(category);
    });
    this.save();
    return data;
  }

  createOne(data: ITool): ITool {
    data.id = CoreUtils.createUUID();
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: ITool[]): ITool[] {
    data.forEach((category: ITool) => {
      const index = this.data.findIndex((c: ITool) => c.id === category.id);
      this.data[index] = category;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: ITool): ITool {
    const index = this.data.findIndex((category: ITool) => category.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  delete(data: ITool[]): ITool[] {
    data.forEach((category: ITool) => {
      const index = this.data.findIndex((c: ITool) => c.id === category.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): ITool {
    const index = this.data.findIndex((category: ITool) => category.id === id);
    const category = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return category;
  }
}
