
export interface XtalSliceProps<T = any> {
    list: T[];
    value: Slices
}

export interface ITreeNode{

}

export type Slices = {[key: string]: ITreeNode[]};

export interface XtalSliceActions{
    onList(self: this): Promise<Slices>;
}