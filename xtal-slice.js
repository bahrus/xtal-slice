import { XE } from 'xtal-element/src/XE.js';
export class XtalSlice extends HTMLElement {
    async onList({ list }) {
        const slices = {};
        for (const row of list) {
            for (const key in row) {
                if (!slices[key]) {
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
        console.log(newSlicePath);
        const slice = this.slices[newSlicePath];
        if (slice.subSlices !== undefined)
            return;
        slice.subSlices = {};
        const { subSlices, values, list } = slice;
        for (const value of values) {
            if (value === null)
                continue;
            const sVal = value.toString();
            subSlices[sVal] = {
                values: new Set(),
                list: [],
            };
        }
        for (const row of list) {
            const val = row[newSlicePath];
            if (val === null)
                continue;
            const subSlice = subSlices[val.toString()];
            subSlice.list.push(row);
            subSlice.values.add(val);
        }
        console.log(subSlices);
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
