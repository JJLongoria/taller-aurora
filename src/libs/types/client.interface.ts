import { PartialBy } from "./partial";

export interface IClient {
    id: string;
    name: string;
    alias: string;
}

export type IClientInput = PartialBy<IClient, 'id'>;