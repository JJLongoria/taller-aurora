import { PartialBy } from "./partial";

export interface IProductSale {
    product: string;
    productVariant: string;
    units: number;
    price: number;
    unitPrice: number;
    profit: number;
}

export interface ISale {
    id: string;
    name: string;
    number: number;
    products: IProductSale[];
    units: number;
    price: number;
    profit: number;
    salesDate: Date;
}

export type ISaleInput = PartialBy<ISale, 'id' | 'name' | 'number'>;