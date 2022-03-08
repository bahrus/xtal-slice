import { XE } from 'xtal-element/src/XE.js';
export class XtalSlice extends HTMLElement {
    async onList({ list }) {
        const res = {};
        for (const row of list) {
            for (const key in row) {
                if (!res[key]) {
                    res[key] = [];
                }
                res[key].push(row[key]);
            }
        }
        console.log({ list, res });
        return res;
    }
}
const xe = new XE({
    config: {
        tagName: 'xtal-slice',
        actions: {
            onList: 'list'
        },
        style: {
            display: 'none'
        }
    },
    superclass: XtalSlice
});
