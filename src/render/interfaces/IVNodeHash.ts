/// <reference path="../../../typings/browser.d.ts" />

import * as vd from "virtual-dom";

export interface IVNodeHash {
    name: string;
    vnode: vd.VNode;
}

export default IVNodeHash;