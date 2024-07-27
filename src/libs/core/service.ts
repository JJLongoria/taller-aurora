import { EventEmitter } from "@angular/core";

export interface Service<T> {
    onLoad: EventEmitter<any>;
    data: T[];
    dataLoaded: boolean;
    get isDataLoaded(): boolean;

    load(): void;
    save(): void;
    getAll(): T[];
    find(query: { [key: string]: any}): T[];
    findById(id: string): T;
    create(data: T[]): T[];
    createOne(data: T): T;
    update(data: T[]): T[];
    updateById(id: string, data: T): T;
    delete(data: T[]): T[];
    deleteById(id: string): T;
}