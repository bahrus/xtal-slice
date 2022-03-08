import { XE } from 'xtal-element/src/XE.js';
export class XtalSlice extends HTMLElement {
    async onList({ list }) {
        console.log(list);
    }
}
const xe = new XE({
    config: {
        tagName: 'xtal-slice',
        propDefaults: {},
        actions: {
            onList: 'list'
        },
        style: {
            display: 'none'
        }
    },
    superclass: XtalSlice
});
