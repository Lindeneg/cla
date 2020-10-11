import {
    TreeClientCallbacks,
    TreeClientInitData,
    TreeClientChangedData,
    ObserverDomInit,
    ObserverDomChange
} from '../util/types';
import {
    TreeMirrorClient
} from '../lib/treeMirror';
import {
    Logger
} from '../util/util';


export class DOMObserver {

    public treeMirrorClient: TreeMirrorClient;

    private _targetNode: Node;
    private _callbacks: TreeClientCallbacks;

    constructor(targetNode: Node, callbacks: TreeClientCallbacks) {

        Logger.log('initializing dom observer');

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
            Logger.log('connecting dom mirror');
            this.treeMirrorClient = this.createTreeMirror();
        } else {
            Logger.log('dom mirror already connected');
        }
    }

    public disconnect(): void {
        if (this.treeMirrorClient !== null) {
            Logger.log('disconnecting dom mirror');
            this.treeMirrorClient.disconnect();
            this.treeMirrorClient = null;
        } else {
            Logger.log('dom mirror already disconnected');
        }
    }

    public static createFromTargetObject(initTarget: ObserverDomInit[], changedTarget: ObserverDomChange[]): DOMObserver {
        // redo std callbacks, check for relevant changes, ignore where possible
        const target: Node = document, callbacks: TreeClientCallbacks = {
            init: (data: TreeClientInitData) => {
                Logger.log('handling initial dom');
                Logger.log(data);
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
                Logger.log('handling ' + (data.attrs.length + data.removed.length + data.changed.length + data.text.length) + ' dom mutations');
                Logger.log(data);
                changedTarget.push({
                    timestamp: new Date().getTime(),
                    dom: data
                });
            }
        };
        return new DOMObserver(target, callbacks);
    }
}