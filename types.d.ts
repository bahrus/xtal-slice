
export interface XtalSliceProps<T = any> {
    list: T[];
    value: {[key: string]: ITreeNode[]}
}

export interface ITreeNode{

}

export interface XtalSliceActions{
    onList(self: this): Promise<void>;
}