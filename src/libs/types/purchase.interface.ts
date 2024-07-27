import { PartialBy } from "./partial";
import { Seller } from "./seller.interface";

export interface IPurchase {
    id: string;
    name: string;
    number: number;
    materialIds: string[];
    description: string;
    seller: Seller;
    quantity: number;
    totalPrice: number;
    relativePrice: number;
    units?: number | null;
    priceCalculation: 'g' | 'g/u' | 'l' | 'l/u' | 'u' | 'm' | 'm/u' | 'm2' | 'm2/u';
    date: Date;
    updateMaterialsPrice: boolean;
    updateMaterialsQuantity: boolean;
    scale: string;
}

export type IPurchaseInput = PartialBy<IPurchase, 'id' | 'description' | 'name' | 'number'>;