import { PartialBy } from "./partial";

export interface IProductMaterial {
    materialId: string;
    scale: string;
    quantity: number;
    normalizedQuantity?: number;
}

export interface IProduct {
    id: string;
    name: string;
    description: string;
    variants: IProductVariant[];
    image: string;
}

export interface IProductVariant {
    id: string;
    name: string;
    description: string;
    materials: IProductMaterial[];
    tools: string[];
    unitsSold?: number;
    image: string;
    unitsProduced?: number;
}

export type IProductInput = PartialBy<IProduct, 'id' | 'description' | 'variants'>;