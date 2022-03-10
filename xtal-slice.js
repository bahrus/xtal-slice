import { XE } from 'xtal-element/src/XE.js';
import { getProp } from 'trans-render/lib/getProp.js';
export class XtalSlice extends HTMLElement {
    async onList({ list }) {
        const slices = {};
        for (const row of list) {
            for (const key in row) {
                if (slices[key] === undefined) {
                    slices[key] = {
                        values: new Set(),
                        list,
                    };
                }
                slices[key].values.add(row[key]);
            }
        }
        console.log({ list, slices });
        return { slices };
    }
    onNewSlicePath({ newSlicePath }) {
        const split = newSlicePath.split('.');
        const slice = getProp(this, split);
        if (slice === undefined)
            throw '404';
        if (slice.slices !== undefined)
            return;
        slice.slices = {};
        this.subSlice(slice, split.pop());
    }
    subSlice(slice, key) {
        const { slices, values, list } = slice;
        for (const value of values) {
            if (value === null || value === undefined)
                continue;
            const sVal = value.toString();
            const filteredList = list.filter(x => x[key] === value);
            const slice = {
                list: filteredList,
                slices: {}
            };
            const subSlices = slice.slices;
            for (const row of filteredList) {
                for (const key in row) {
                    if (subSlices[key] === undefined) {
                        subSlices[key] = {
                            values: new Set(),
                            list: filteredList,
                        };
                    }
                    const val = row[key];
                    if (val === undefined || val === null)
                        continue;
                    subSlices[key].values.add(val);
                }
            }
            slices[sVal] = slice;
        }
        console.log(slices);
    }
}
const xe = new XE({
    config: {
        tagName: 'xtal-slice',
        actions: {
            onList: 'list',
            onNewSlicePath: 'newSlicePath'
        },
        style: {
            display: 'none'
        }
    },
    superclass: XtalSlice
});
