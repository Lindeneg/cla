import {
    DOMObserver
} from '../modules/domObserver';
import {
    EventObserver
} from '../modules/eventObserver';
import { 
    ObserverDomInit,
    ObserverDomChange,
    EventState
} from '../util/types';


export class Observer {

    public initialDom: ObserverDomInit[];
    public changedDom: ObserverDomChange[];
    public clientEvents: EventState[];

    private _domObserver: DOMObserver;
    private _eventObserver: EventObserver;

    constructor() {

        this.initialDom = [];
        this.changedDom = [];
        this.clientEvents = [];

        this._domObserver = DOMObserver.createFromTargetObject(this.initialDom, this.changedDom);
        this._eventObserver = new EventObserver(this.clientEvents);
    }

    public start() {
        this._domObserver.connect();
        this._eventObserver.start();
    }

    public stop() {
        this._domObserver.disconnect();
        this._eventObserver.stop();
    }
}