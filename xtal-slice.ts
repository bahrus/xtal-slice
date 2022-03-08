import {XtalSliceActions, XtalSliceProps, Slices} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalSlice extends HTMLElement implements XtalSliceActions{
    async onList({list}: this){
        const res: Slices = {};
        for(const row of list){
            for(const key in row){
                if(!res[key]){
                    res[key] = [];
                }
                res[key].push(row[key]);
            }
        }
        console.log({list, res});
        return res;
        
    }
}

export interface XtalSlice extends XtalSliceProps{}

const xe = new XE<XtalSliceProps, XtalSliceActions>({
    config:{
        tagName: 'xtal-slice',
        actions:{
            onList: 'list'
        },
        style:{
            display:'none'
        }
    },
    superclass: XtalSlice
});