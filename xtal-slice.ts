import {XtalSliceActions, XtalSliceProps, Slices, Slice} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalSlice extends HTMLElement implements XtalSliceActions{
    async onList({list}: this){
        const slices: Slices = {
        };
        for(const row of list){
            for(const key in row){
                if(!slices[key]){
                    slices[key] = {
                        values: new Set(),
                        list,
                    };
                }
                slices[key].values.add(row[key]);
            }
        }
        console.log({list, slices});
        return {slices};
        
    }

    onNewSlicePath({newSlicePath}: this): void {
        console.log(newSlicePath);
        const slice = this.slices[newSlicePath];
        if(slice.slices !== undefined) return;
        slice.slices = {};
        this.subSlice(slice, newSlicePath);
    }

    subSlice(slice: Slice, key: string){
        const {slices, values, list} = slice;
        for(const value of values){
            if(value === null) continue;
            const sVal = value.toString();
            slices![sVal] = {
                values: new Set(),
                list: [],
            };
        }
        for(const row of list){
            const val = row[key];
            if(val === null) continue;
            const subSlice = slices![val.toString()];
            subSlice.list.push(row);
            subSlice.values.add(val);
        }
        console.log(slices);
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