import { XE } from 'xtal-element/src/XE.js';
import { getProp } from 'trans-render/lib/getProp.js';
export class XtalSlice extends HTMLElement {
    onList({ list }) {
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
        return {
            slices,
            updateCount: 1,
        };
    }
    #sliceToNode = new WeakMap();
    updateTreeView({ slices }, passedInSlices, parentNode) {
        const localSlices = passedInSlices || slices;
        const treeView = [];
        for (const key in localSlices) {
            const path = parentNode ? `${parentNode.path}.slices.${key}` : `slices.${key}`;
            const id = path;
            const slice = localSlices[key];
            const node = {
                name: `By ${key}`,
                path,
                id
            };
            const existingNode = this.#sliceToNode.get(slice);
            if (existingNode !== undefined) {
                if (existingNode.name === node.name && existingNode.path === node.path && existingNode.id === node.id) {
                    Object.assign(node, existingNode);
                }
            }
            this.#sliceToNode.set(slice, node);
            if (slice.slices !== undefined) {
                this.updateTreeView(this, slice.slices, node);
            }
            treeView.push(node);
        }
        treeView.sort((a, b) => a.name.localeCompare(b.name));
        if (parentNode !== undefined) {
            parentNode.children = treeView;
        }
        else {
            return {
                treeView
            };
        }
    }
    onNewSlicePath({ newSlicePath, updateCount }) {
        const split = newSlicePath.split('.');
        const slice = getProp(this, split);
        if (slice === undefined)
            throw '404';
        if (slice.slices !== undefined)
            return;
        slice.slices = {};
        this.subSlice(slice, split.pop());
        updateCount++;
        return { slice, updateCount };
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
    }
}
const xe = new XE({
    config: {
        tagName: 'xtal-slice',
        propDefaults: {
            updateCount: 0,
        },
        propInfo: {
            slice: {
                parse: false,
                notify: {
                    dispatch: true,
                }
            },
            treeView: {
                parse: false,
                notify: {
                    dispatch: true,
                }
            }
        },
        actions: {
            onList: 'list',
            onNewSlicePath: 'newSlicePath',
            updateTreeView: 'updateCount',
        },
        style: {
            display: 'none'
        }
    },
    superclass: XtalSlice
});
