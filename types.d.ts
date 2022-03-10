
export interface XtalSliceProps<T = any> {
    list: T[];
    slices: Slices<T>;
    
    newSlicePath: string;
}

export interface Slice<T = any>{
    values: Set<string | number | boolean | null | undefined>;
    list: T[];
    slices?: Slices<T>;
    processed?: boolean;
}

export type Slices<T = any> = {[key: string]:  Slice<T>};

export interface XtalSliceActions{
    onList(self: this): Promise<{slices:Slices}>;

    onNewSlicePath(self: this): void;
}