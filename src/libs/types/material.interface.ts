import { PartialBy } from "./partial";

export interface IMaterial {
    id: string;
    code: string;
    name: string;
    description: string;
    lowPrice: number;
    highPrice: number;
    priceCalculation: 'g' | 'l' | 'u' | 'm' | 'm2';
    image: string;
    qr: string;
    categoryIds: string[];
    quantity: number;
    location: string;
    minThreshold: number;
    obsolete: boolean;
}

export type IMaterialInput = PartialBy<IMaterial, 'id' | 'description' | 'qr' | 'image' | 'location' | 'obsolete'>;