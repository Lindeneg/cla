import {
    TreeMirrorClient
} from '../lib/treeMirror';
import {
    TreeClientCallbacks,
    TreeClientInitData,
    TreeClientChangedData,
    ObserverDomInit,
    ObserverDomChange
} from '../util/types';


export class DOMObserver {

    public treeMirrorClient: TreeMirrorClient;

    private _targetNode: Node;
    private _callbacks: TreeClientCallbacks;

    constructor(targetNode: Node, callbacks: TreeClientCallbacks) {

        this.treeMirrorClient = null;
        this._targetNode = targetNode;
        this._callbacks = callbacks;
    }

    private createTreeMirror(): TreeMirrorClient {
        return new TreeMirrorClient(this._targetNode, {
            initialize: (rootId, children) => {
                const initData: TreeClientInitData = {
                    rootId: rootId,
                    children: children
                };
                this._callbacks.init(initData);
            },

            applyChanged: (removed, addedOrMoved, attributes, text) => {
                if (removed.length || addedOrMoved.length || attributes.length || text.length) {
                    const data: TreeClientChangedData = {
                        removed: removed,
                        changed: addedOrMoved,
                        attrs: attributes,
                        text: text
                    };
                    this._callbacks.changed(data);
                }
            }
        });
    }

    public connect(): void {
        if (this.treeMirrorClient === null) {
            this.treeMirrorClient = this.createTreeMirror();
        }
    }

    public disconnect(): void {
        if (this.treeMirrorClient !== null) {
            this.treeMirrorClient.disconnect();
            this.treeMirrorClient = null;
        }
    }

    public static createFromTargetObject(initTarget: ObserverDomInit[], changedTarget: ObserverDomChange[]): DOMObserver {
        const target: Node = document, callbacks: TreeClientCallbacks = {
            init: (data: TreeClientInitData) => {
                console.log('Initial DOM');
                console.log(data);
                initTarget.push({
                    timestamp: new Date().getTime(),
                    dom: data,
                    title: document.title,
                    host: document.location.host,
                    pathname: document.location.pathname,
                    search: document.location.search,
                    userAgent: navigator.userAgent
                });
            },
            changed: (data: TreeClientChangedData) => {
                // todo: detect change importance, ignore where possible
                console.log('Changed DOM');
                console.log(data);
                changedTarget.push({
                    timestamp: new Date().getTime(),
                    dom: data
                });
            }
        };
        return new DOMObserver(target, callbacks);
    }
}