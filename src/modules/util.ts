import {
    EVENT_TYPE,
    ClEventState,
    CLMutation,
    Record,
    EventListener,
    CLRecord
} from './types';
import {
    NAMED_EVENTS,
    B64_CHARACTERS,
    B64_SLICE_RANGE,
    G_WIN,
    G_DOC,
    STRINGIFY_EOF
} from './constants';
import {
    EventSummary
} from './eventSummary'


export const encodeB64 = (data: string): string => {
    if (!data || data === STRINGIFY_EOF) {
        return '';
    }
    let _c: number, _t: number, _l: number;
    let _ha: number, _hb: number, _hc: number, _hd: number;
    let _b: number, _i: number = 0,
        _a: number = 0;
    let _e: string = "",
        _arr: string[] = [];
    do {
        _c = data.charCodeAt(_i++);
        _t = data.charCodeAt(_i++);
        _l = data.charCodeAt(_i++);
        _b = _c << 16 | _t << 8 | _l;
        _ha = _b >> 18 & 0x3f;
        _hb = _b >> 12 & 0x3f;
        _hc = _b >> 6 & 0x3f;
        _hd = _b & 0x3f;
        _arr[_a++] = B64_CHARACTERS.charAt(_ha) + B64_CHARACTERS.charAt(_hb) + B64_CHARACTERS.charAt(_hc) + B64_CHARACTERS.charAt(_hd);
    } while (_i < data.length);
    _e = _arr.join('');
    const r: number = data.length % 3;
    return (r ? _e.slice(0, r - B64_SLICE_RANGE) : _e) + '==='.slice(r || B64_SLICE_RANGE);
}

export const getMouseEventType = (event: string): number => {
    const result = NAMED_EVENTS.indexOf(event.toLowerCase());
    return result > -1 ? result + EVENT_TYPE.MOUSE_MOVE : result;
}

export const getNewEventState = (): ClEventState => {
    return ({
        timestamp: new Date().getTime(),
        target: '',
        pathname: '',
        scrollDirection: EVENT_TYPE.DEFAULT_EVENT_STATE,
        clickType: EVENT_TYPE.DEFAULT_EVENT_STATE,
        event: EVENT_TYPE.DEFAULT_EVENT_STATE,
        height: EVENT_TYPE.DEFAULT_EVENT_STATE,
        width: EVENT_TYPE.DEFAULT_EVENT_STATE,
        top: EVENT_TYPE.DEFAULT_EVENT_STATE,
        left: EVENT_TYPE.DEFAULT_EVENT_STATE,
        x: EVENT_TYPE.DEFAULT_EVENT_STATE,
        y: EVENT_TYPE.DEFAULT_EVENT_STATE
    });
}

export const getNewMutationEvent = (): CLMutation => {
    return ({
        timestamp: new Date().getTime(),
        records: []
    });
}

export const getNewRecord = (): Record => {
    return ({
        target: '',
        oldAttr: '',
        newAttr: '',
        mutationType: -1,
        added: [],
        removed: []
    });
}

export const getElementPath = (element: HTMLElement | Node): string => {
    if (element && element instanceof HTMLElement) {
        const path: string[] = [];
        let tmp: HTMLElement = element.parentElement;
        while (tmp && tmp.tagName.toLowerCase() !== 'html') {
            path.push(stringifyElementSelector(tmp));
            tmp = tmp.parentElement;
        }
        let result: string = path.reverse().join(' > ') + ' > ' + stringifyElementSelector(element);
        return result.match(/>/g).length > 1 ? result : result.replace(/>/, '').trim();
    }
    return '';
}

export const stringifyElementSelector = (element: HTMLElement): string => {
    if (element) {
        const name = element.tagName.toLowerCase();
        const id = element.id,
            classes = element.classList.toString().replace(/\s/g, '.');
        if (id) {
            return name + '#' + id;
        }
        if (classes) {
            return name + '.' + classes;
        }
        return name;
    }
    return '';
}

const appendKVString = (container: string, key: string, value: string, limit: number, i: number) => {
    return container += key + '=' + value + ( i < limit ? '|' : '');
}

export const getAttrs = (element: HTMLElement): string => {
    const keys: string[] = element.getAttributeNames();
    let result: string = '';
    for (let i: number = 0; i < keys.length; i++) {
        result = appendKVString(result, keys[i], element.getAttribute(keys[i]), keys.length - 1, i);
    }
    return result;
}

export const getNodeChanges = (...args: NodeList[]): [CLRecord[], CLRecord[]] => {
    const result: [CLRecord[], CLRecord[]] = [[], []];
    if (args && args.length === 2) {
        for (let i: number = 0; i < args.length; i++) {
            for (let j: number = 0; j < args[i].length; j++) {
                const node: Node = args[i][j];
                result[i].push({
                    tagName: node.nodeName.toLowerCase(),
                    // @ts-ignore
                    attrs: node.nodeType === 3 ? '' : getAttrs(node),
                    parent: getElementPath(node.parentElement),
                    content: node.textContent,
                    nodeType: node.nodeType
                });
            }
        }
    }
    return result;
}

export const stringifyObject = (obj: object): string => {
    let result = '';
    if (obj && typeof obj === 'object') {
        const keys = Object.keys(obj);
        for (let i: number = 0; i < keys.length; i++) {
            result = appendKVString(result, keys[i], obj[keys[i]], keys.length - 1, i);
        }
    }
    return result;
}

export const isNumber = (n: any): boolean => {
    return n !== undefined && typeof n === 'number' && !isNaN(n);
}

export const addEventListeners = (eventListeners: EventListener[]): boolean => {
    if (eventListeners && eventListeners.length > 0) {
        for (let i = 0; i < eventListeners.length; i++) {
            const event = eventListeners[i];
            try {
                event.origin.addEventListener(event.listener, event.handler);
            } catch (err) {
                console.error(err);
            }
        }
        return true;
    }
    return false;
}

export const removeEventListeners = (eventListeners: EventListener[]): boolean => {
    if (eventListeners && eventListeners.length > 0) {
        for (let i = 0; i < eventListeners.length; i++) {
            const event = eventListeners[i];
            try {
                event.origin.removeEventListener(event.listener, event.handler);
            } catch (err) {
                console.error(err);
            }
        }
        return true;
    }
    return false;
}

export const getWindowsSize = (): number[] => {
    if (typeof G_WIN.innerWidth !== 'undefined') {
        return [G_WIN.innerWidth, G_WIN.innerHeight];
    }
    if (typeof G_DOC.documentElement !== 'undefined' &&
        typeof G_DOC.documentElement.clientWidth !== 'undefined') {
        return ([
            G_DOC.documentElement.clientWidth,
            G_DOC.documentElement.clientHeight
        ]);
    }
    return [EVENT_TYPE.WINDOW_SCREEN_NONE, EVENT_TYPE.WINDOW_SCREEN_NONE];
}

export const getScrollLeft = (): number => {
    if (G_WIN.pageXOffset) {
        return G_WIN.pageXOffset;
    } else if (G_DOC.documentElement) {
        return G_DOC.documentElement.scrollLeft;
    } else if (G_DOC.body) {
        return G_DOC.body.scrollLeft;
    } else {
        return 0;
    }
}

export const getScrollTop = (): number => {
    if (G_WIN.pageYOffset) {
        return G_WIN.pageYOffset;
    } else if (G_DOC.documentElement) {
        return G_DOC.documentElement.scrollTop;
    } else if (G_DOC.body) {
        return G_DOC.body.scrollTop;
    } else {
        return 0;
    }
}

export const tryGetNumber = (et: string): number | string => {
    let result = parseInt(et);
    if (isNumber(result)) {
        return result;
    }
    return et;
}

export const createListeners = (eventSummary: EventSummary): EventListener[] => {
    const callback: (event: Event) => boolean = eventSummary.handleEvent.bind(eventSummary);
    const result: EventListener[] = [];
    const events: [Window | Document, string][] = [
        [G_DOC, NAMED_EVENTS[0]],
        [G_DOC, NAMED_EVENTS[1]],
        [G_WIN, NAMED_EVENTS[2]],
        [G_WIN, NAMED_EVENTS[3]],
        [G_WIN, NAMED_EVENTS[4]]
    ];
    for (let i: number = 0; i < events.length; i++) {
        let e: [Window | Document, string] = events[i];
        result.push({
            origin: e[0],
            listener: e[1],
            handler: callback
        });
    }
    return result;
}