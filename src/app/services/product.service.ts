import { EventEmitter, Injectable } from '@angular/core';
import { Service } from 'src/libs/core/service';
import { IProduct, IProductVariant } from 'src/libs/types/product.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { MathUtils } from 'src/libs/utils/math.utils';
import { StrUtils } from 'src/libs/utils/str.utils';
import { IpcService } from './ipc.service';
import { MaterialService } from './material.service';
import { ToolService } from './tool.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements Service<IProduct> {

  onLoad: EventEmitter<any> = new EventEmitter();
  data: IProduct[] = [];
  dataLoaded = false;
  get isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  constructor(
    private readonly ipcService: IpcService,
    private readonly materialService: MaterialService,
    private readonly toolService: ToolService) {
    this.load();
  }

  load(): void {
    this.ipcService.invoke('loadProducts').then((result) => {
      if (result) {
        this.data = result as IProduct[];
      }
      this.dataLoaded = true;
      this.onLoad.emit();
    }).catch((err) => {

    });
  }

  save(): void {
    this.ipcService.invoke('saveProducts', this.data).then((result) => {
    }).catch((err) => {
    });
  }

  getAll(): IProduct[] {
    return this.data;
  }

  find(query: { [key: string]: any}): IProduct[] {
    return this.data.filter((element: IProduct) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof IProduct];
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

  findById(id: string): IProduct {
    return this.data.find((product: IProduct) => product.id === id) as IProduct;
  }

  create(data: IProduct[]): IProduct[] {
    data.forEach((product: IProduct) => {
      product.id = CoreUtils.createUUID();
      this.data.push(product);
    });
    this.save();
    return data;
  }

  createOne(data: IProduct): IProduct {
    data.id = CoreUtils.createUUID();
    this.data.push(data);
    this.save();
    return data;
  }

  update(data: IProduct[]): IProduct[] {
    data.forEach((product: IProduct) => {
      const index = this.data.findIndex((c: IProduct) => c.id === product.id);
      this.data[index] = product;
    });
    this.save();
    return data;
  }

  updateById(id: string, data: IProduct): IProduct {
    const index = this.data.findIndex((product: IProduct) => product.id === id);
    this.data[index] = data;
    this.save();
    return data;
  }

  updateVariant(productId: string, productVariant: IProductVariant){
    const index = this.data.findIndex((product: IProduct) => product.id === productId);
    if(!this.data[index].variants){
      this.data[index].variants = [];
    }
    const variantIndex = this.data[index].variants.findIndex((variant: IProductVariant) => variant.id === productVariant.id);
    if(variantIndex >= 0){
      this.data[index].variants[variantIndex] = productVariant;
    } else {
      this.data[index].variants.push(productVariant);
    }
    this.save();
  }

  delete(data: IProduct[]): IProduct[] {
    data.forEach((product: IProduct) => {
      const index = this.data.findIndex((c: IProduct) => c.id === product.id);
      this.data.splice(index, 1);
    });
    this.save();
    return data;
  }

  deleteById(id: string): IProduct {
    const index = this.data.findIndex((product: IProduct) => product.id === id);
    const product = this.data[index];
    this.data.splice(index, 1);
    this.save();
    return product;
  }

  calculateVariantCost(variant: IProductVariant) {
    let price = 0;
    for (const materialData of variant.materials) {
      const material = this.materialService.findById(materialData.materialId);
      if (material) {
        price += (material.highPrice || 0) * (materialData.normalizedQuantity || 0);
      }
    }
    for (const toolId of variant.tools) {
      const tool = this.toolService.findById(toolId);
      if (tool) {
        price += tool.usePrice || 0;
      }
    }
    return MathUtils.round(price, 3);
  }

  calculateVariantEstimatedCost(variant: IProductVariant){
    return MathUtils.round(this.calculateVariantCost(variant) * 1.1, 3);
  }

  calculateVariantPrice(variant: IProductVariant) {
    return MathUtils.round(this.calculateVariantEstimatedCost(variant) * 3, 3);
  }

  calculateProductCost(product: IProduct) {
    let cost = 0;
    for (const variant of product.variants) {
      cost += this.calculateVariantCost(variant);
    }
    return cost;
  }
  
  getProductMaxCost(product: IProduct){
    let cost;
    for (const variant of product.variants) {
      const varianPrice = this.calculateVariantCost(variant);
      if(!cost || varianPrice > cost){
        cost = varianPrice;
      }
    }
    return cost || 0;
  }

  geProductMinCost(product: IProduct){
    let cost;
    for (const variant of product.variants) {
      const varianPrice = this.calculateVariantCost(variant);
      if(!cost || varianPrice < cost){
        cost = varianPrice;
      }
    }
    return cost || 0;
  }

  getProductAvgCost(product: IProduct){
    const maxCost = this.getProductMaxCost(product);
    const minCost = this.geProductMinCost(product);
    return (maxCost + minCost) / 2;
  }
}
