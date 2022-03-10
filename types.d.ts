
export interface XtalSliceProps<T = any> {
    list: T[];
    slices: Slices<T>;
    slice: Slice;
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
    onList(self: this): {slices:Slices};

    onNewSlicePath(self: this): {
        slice:Slice
    } | void;
}