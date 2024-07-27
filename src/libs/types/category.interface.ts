import { PartialBy } from "./partial";

export interface ICategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
}

export type ICategoryInput = PartialBy<ICategory, 'id' | 'description' | 'icon' | 'color'>;