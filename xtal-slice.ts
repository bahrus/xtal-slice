import {XtalSliceActions, XtalSliceProps, Slices} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalSlice extends HTMLElement implements XtalSliceActions{
    async onList({list}: this){
        const value: Slices = {
        };
        for(const row of list){
            for(const key in row){
                if(!value[key]){
                    value[key] = {
                        values: new Set(),
                        parentList: list,
                    };
                }
                value[key].values.add(row[key]);
            }
        }
        console.log({list, value});
        return {value};
        
    }

    onNewSlicePath({newSlicePath}: this): void {
        console.log(newSlicePath);
        const slice = this.value[newSlicePath];
        if(slice.lists !== undefined) return;
        slice.lists = {};
        const {lists, values, parentList} = slice;
        for(const value of values){
            const sVal = value === null ? 'null' : value.toString();
            lists[sVal] = [];
        }
        for(const row of parentList){
            const val = row[newSlicePath];
            lists[val === null ? 'null' : val.toString()].push(row);
        }
        console.log(lists);
    }
}

export interface XtalSlice extends XtalSliceProps{}

const xe = new XE<XtalSliceProps, XtalSliceActions>({
    config:{
        tagName: 'xtal-slice',
        actions:{
            onList: 'list',
            onNewSlicePath: 'newSlicePath'
        },
        style:{
            display:'none'
        }
    },
    superclass: XtalSlice
});