import { PartialBy } from "./partial";

export interface IOrderProduct {
    productId: string;
    productVariantId: string;
    quantity: number;
}

export interface IOrder {
    id: string;
    name: string;
    number: number;
    client: string;
    description: string;
    products: IOrderProduct[];
    price: number;
    costPrice: number;
    estimatedCostPrice: number;
    paid: boolean;
    paidment: number;
    estimatedProfit: number;
    profit: number;
    deliveryDate?: Date;
    estimatedDeliveryDate: Date;
}

export type IOrderInput = PartialBy<IOrder, 'id' | 'description' | 'name' | 'number'>;