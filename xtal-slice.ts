import {XtalSliceActions, XtalSliceProps} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalSlice extends HTMLElement implements XtalSliceActions{
    async onList({list}: this){
        console.log(list);
    }
}

export interface XtalSlice extends XtalSliceProps{}

const xe = new XE<XtalSliceProps, XtalSliceActions>({
    config:{
        tagName: 'xtal-slice',
        propDefaults:{
            
        },
        actions:{
            onList: 'list'
        },
        style:{
            display:'none'
        }
    },
    superclass: XtalSlice
});