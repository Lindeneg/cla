import {
    NAMED_EVENTS
} from '../util/constants';
import {
    EVENT,
    EventListener
} from '../util/types';
import {
    EventObserver
} from '../modules/eventObserver';


export const getMouseEventType = (event: string): number => {
    const result = NAMED_EVENTS.indexOf(event.toLowerCase());
    return result > -1 ? result + EVENT.MOUSE_MOVE : result;
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

export const addEventListeners = (eventListeners: EventListener[]): boolean => {
    if (eventListeners && eventListeners.length > 0) {
        for (let i = 0; i < eventListeners.length; i++) {
            const event: EventListener = eventListeners[i];
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
        for (let i: number = 0; i < eventListeners.length; i++) {
            const event: EventListener = eventListeners[i];
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
    if (typeof window.innerWidth !== 'undefined') {
        return [window.innerWidth, window.innerHeight];
    }
    if (typeof window.document.documentElement !== 'undefined' &&
        typeof window.document.documentElement.clientWidth !== 'undefined') {
        return ([
            window.document.documentElement.clientWidth,
            window.document.documentElement.clientHeight
        ]);
    }
    return [0, 0];
}

export const getScrollLeft = (): number => {
    if (window.pageXOffset) {
        return window.pageXOffset;
    } else if (window.document.documentElement) {
        return window.document.documentElement.scrollLeft;
    } else if (window.document.body) {
        return window.document.body.scrollLeft;
    } else {
        return 0;
    }
}

export const getScrollTop = (): number => {
    if (window.pageYOffset) {
        return window.pageYOffset;
    } else if (window.document.documentElement) {
        return window.document.documentElement.scrollTop;
    } else if (window.document.body) {
        return window.document.body.scrollTop;
    } else {
        return 0;
    }
}

export const tryGetNumber = (et: string): number | string => {
    let result = parseInt(et);
    if (result !== undefined && typeof result === 'number' && !isNaN(result)) {
        return result;
    }
    return et;
}

export const createListeners = (eventObserver: EventObserver): EventListener[] => {
    const callback: (event: Event) => boolean = eventObserver.handleEvent.bind(eventObserver);
    const result: EventListener[] = [];
    const events: [Window | Document, string][] = [
        [window.document, NAMED_EVENTS[0]],
        [window.document, NAMED_EVENTS[1]],
        [window, NAMED_EVENTS[2]],
        [window, NAMED_EVENTS[3]],
        [window, NAMED_EVENTS[4]]
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

export const b64EncodeObject = (data: object) => {
    return btoa(JSON.stringify(data));
}

export class Logger {
    private static state = 0;

    public static toggle(state: number) {
        Logger.state = state;
    }

    public static log(msg: any) {
        Logger.toggle(window['webalyzeDebug'] || 0);
        if (Logger.state) {
            if (typeof msg === 'string') {
                console.log('webalyze debug ' + new Date().getTime() + ' || ' + msg);
            } else if (typeof msg === 'object') {
                console.log(msg);
            }
        }
    }
}