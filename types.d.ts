
export interface XtalSliceProps<T = any> {
    list: T[];
    slices: Slices<T>;
    slice: Slice;
    newSlicePath: string;
    updateCount: number;
    treeView: ITreeNode[];
    splitNameBy: RegExp;
}

export interface ITreeNode{
    name: string,
    children?: ITreeNode[];
    path: string,
    id: string,
    open?: boolean;
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
        slice:Slice,
        updateCount: number,
    } | void;

    updateTreeView(self: this): {
        treeView: ITreeNode[]
    } | void;
}