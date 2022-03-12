import {XtalSliceActions, XtalSliceProps, Slices, Slice, ITreeNode} from './types';
import {XE} from 'xtal-element/src/XE.js';
import {getProp} from 'trans-render/lib/getProp.js';

export class XtalSlice extends HTMLElement implements XtalSliceActions{
    onList({list}: this){
        const slices: Slices = {
        };
        for(const row of list){
            for(const key in row){
                if(slices[key] === undefined){
                    slices[key] = {
                        values: new Set(),
                        list,
                    };
                }
                slices[key].values.add(row[key]);
            }
        }
        return {
            slices,
            updateCount: 1,
        };
    }

    updateTreeView({slices}: this, passedInSlices?: Slices, parentNode?: ITreeNode){
        const localSlices = passedInSlices || slices!;
        const treeView: ITreeNode[] = [];
        for(const key in localSlices){
            const node: ITreeNode = {
                name: key,
                path: parentNode ? `${parentNode.path}.slices.${key}` : `slices.${key}`,
            }
            const slice = localSlices[key];
            if(slice.slices !== undefined){
                this.updateTreeView(this, slice.slices, node);
            }
            treeView.push(node);
        }
        if(parentNode !== undefined){
            parentNode.children = treeView;
        }else{
            return {
                treeView
            };
        }
    }

    onNewSlicePath({newSlicePath, updateCount}: this){
        const split = newSlicePath.split('.');
        const slice = getProp(this, split) as Slice;
        if(slice === undefined) throw '404';
        if(slice.slices !== undefined) return;
        slice.slices = {};
        this.subSlice(slice, split.pop()!);
        updateCount++;
        return {slice, updateCount};
    }

    subSlice(slice: Slice, key: string){
        const {slices, values, list} = slice;
        for(const value of values){
            if(value === null || value === undefined) continue;
            const sVal = value.toString();
            const filteredList = list.filter(x => x[key] === value);
            const slice = {
                list: filteredList,
                slices: {}
            } as Slice;
            const subSlices = slice.slices!;
            for(const row of filteredList){
                for(const key in row){
                    if(subSlices[key] === undefined){
                        subSlices[key] = {
                            values: new Set(),
                            list: filteredList,
                        };
                    }
                    const val = row[key];
                    if(val === undefined || val === null) continue;
                    subSlices[key].values.add(val);
                }

            }
            slices![sVal] = slice;
        }
    }
}

export interface XtalSlice extends XtalSliceProps{}

const xe = new XE<XtalSliceProps, XtalSliceActions>({
    config:{
        tagName: 'xtal-slice',
        propDefaults:{
            updateCount: 0,
        },
        propInfo: {
            slice:{
                parse: false,
                notify:{
                    dispatch:true,
                }
            },
            treeView:{
                parse: false,
                notify:{
                    dispatch:true,
                }
            }
        },
        actions:{
            onList: 'list',
            onNewSlicePath: 'newSlicePath',
            updateTreeView: 'updateCount',
        },
        style:{
            display:'none'
        }
    },
    superclass: XtalSlice
});