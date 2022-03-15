import {XtalSliceActions, XtalSliceProps, Slices, Slice, ITreeNode} from './types';
import {XE} from 'xtal-element/src/XE.js';
import {getProp} from 'trans-render/lib/getProp.js';

declare function structuredClone<T>(inp: T): T;
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
    #sliceToNode: WeakMap<Slice, ITreeNode> = new WeakMap();
    updateTreeView({slices, splitNameBy}: this, level=0, passedInSlices?: Slices, parentNode?: ITreeNode, sliced?: Set<string>){
        const localSlices = passedInSlices || slices!;
        const treeView: ITreeNode[] = [];
        for(const key in localSlices){
            if(sliced !== undefined && sliced.has(key)) continue;
            const newSliced = sliced === undefined ? new Set<string>() : structuredClone(sliced);
            const path = parentNode ? `${parentNode.path}.slices.${key}` : `slices.${key}`;
            const id = path;
            const slice = localSlices[key];
            const prefix = (level % 2 === 0) ? 'By ' : '';
            const modifiedKey = (level % 2 === 0) ? key.split(splitNameBy).join(' ') : key;
            const node: ITreeNode = {
                name: `${prefix}${modifiedKey}`,
                path,
                id
            };
            const existingNode = this.#sliceToNode.get(slice);
            if(existingNode !== undefined){
                if(existingNode.name === node.name && existingNode.path === node.path && existingNode.id === node.id){
                    Object.assign(node, existingNode);
                }
            }
            this.#sliceToNode.set(slice, node);
            
            if(slice.slices !== undefined){
                if(level %2 === 0) newSliced.add(key);
                this.updateTreeView(this, level + 1, slice.slices, node, newSliced);
            }
            treeView.push(node);
        }
        treeView.sort((a, b) => a.name.localeCompare(b.name));
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
        const tn = this.#sliceToNode.get(slice);
        if(tn !== undefined){
            tn.open = true;
        }
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
            splitNameBy: /(?=[A-Z])/,
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
            onNewSlicePath: {
                ifAllOf: ['newSlicePath', 'updateCount'],
            },
            updateTreeView: 'updateCount',
        },
        style:{
            display:'none'
        }
    },
    superclass: XtalSlice
});