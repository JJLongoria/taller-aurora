import { PartialBy } from "./partial";

export interface ITool {
    id: string;
    name: string;
    description: string;
    price: number;
    location: string;
    electric: boolean;
    power: number;
    consumption: number;
    amortizationUses: number;
    usePrice: number;
    amortized: boolean;
    uses: number;
    broken: boolean;
    image: string;
}

export type IToolInput = PartialBy<ITool, 'id' | 'description' | 'location' | 'amortized' | 'amortizationUses' | 'usePrice' | 'uses' | 'broken'>;