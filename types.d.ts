
export interface XtalSliceProps<T = any> {
    list: T[];
    value: Slices<T>;
    
    newSlicePath: string;
}

export interface Slice<T = any>{
    values: Set<string | number | boolean | null>;
    parentList: T[];
    lists?: {[key: string]: T[]};
}

export type Slices<T = any> = {[key: string]:  Slice<T>};

export interface XtalSliceActions{
    onList(self: this): Promise<{value:Slices}>;

    onNewSlicePath(self: this): void;
}