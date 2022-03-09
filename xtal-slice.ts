import {XtalSliceActions, XtalSliceProps, Slices, Slice} from './types';
import {XE} from 'xtal-element/src/XE.js';
import {getProp} from 'trans-render/lib/getProp.js';

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
        //console.log(newSlicePath);
        const split = newSlicePath.split('.');
        const slice = getProp(this, split) as Slice;
        if(slice === undefined) throw '404';
        //const slice = this.slices[newSlicePath];
        if(slice.slices !== undefined) return;
        slice.slices = {};
        this.subSlice(slice, split.pop()!);
    }

    subSlice(slice: Slice, key: string){
        const {slices, values, list} = slice;
        debugger;
        for(const value of values){
            if(value === null || value === undefined) continue;
            const sVal = value.toString();
            slices![sVal] = {
                values: new Set(),
                list: [],
                slices: {},
            };
        }
        
        for(const row of list){
            const val = row[key];
            if(val === null || val === undefined) continue;
            const slice = slices![val.toString()];
            slice.list.push(row);
            const subSlices = slice.slices!;
            for(const key in row){
                if(!subSlices[key]){
                    subSlices![key] = {
                        values: new Set(),
                        list,
                    };
                }
                const subVal = row[key];
                const subSlice = subSlices![key];
                //subSlice.list.push(row);
                subSlice.values.add(subVal);
            }

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