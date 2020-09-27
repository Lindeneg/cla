import {
    DOMObserver
} from '../modules/domObserver';
import {
    EventObserver
} from '../modules/eventObserver';
import { 
    ObserverDomInit,
    ObserverDomChange
} from '../util/types';


export class Observer {

    public initialDom: ObserverDomInit[];
    public changedDom: ObserverDomChange[];
    public clientEvents: {};

    private _domObserver: DOMObserver;
    private _eventObserver: EventObserver;

    constructor() {

        this.initialDom = [];
        this.changedDom = [];
        this.clientEvents = [];

        this._domObserver = DOMObserver.createFromTargetObject(this.initialDom, this.changedDom);
    }

    public start() {
        this._domObserver.connect();
    }

    public stop() {
        this._domObserver.disconnect();
    }

    public resetData() {

    }
}