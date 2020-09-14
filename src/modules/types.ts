export enum EVENT_TYPE {
    MOUSE_CLICK_PRIMARY,
    MOUSE_CLICK_MIDDLE,
    MOUSE_CLICK_RIGHT,
    MOUSE_CLICK_BACK,
    MOUSE_CLICK_FORWARD,
    MOUSE_SCROLL_UP,
    MOUSE_SCROLL_DOWN,
    MOUSE_SCROLL_LEFT,
    MOUSE_SCROLL_RIGHT,
    MUTATION_EVENT,
    MUTATION_ATTRIBUTE,
    MUTATION_CHILDLIST,
    CLWA_INIT,
    CLWA_STOP,
    MOUSE_MOVE,
    MOUSE_DOWN,
    MOUSE_SCROLL,
    WINDOW_RESIZE,
    WINDOW_UNLOAD,
    DEFAULT_EVENT_STATE = 10000042,
    WINDOW_SCREEN_NONE = -10000042
}

export enum Movement {
    STAYED_OUT,
    ENTERED,
    STAYED_IN,
    REPARENTED,
    REORDERED,
    EXITED
}

export interface StringMap < T > {
    [key: string]: T;
}

export interface NumberMap < T > {
    [key: number]: T;
}

export interface ClEventState {
    timestamp: number,
    target: string,
    pathname: string,
    scrollDirection: number,
    clickType: number,
    event: number,
    height: number,
    width: number,
    top: number,
    left: number,
    x: number,
    y: number,
    page ? : string,
    host ? : string
}

export interface MutationEvent {
    projection: {
        mutations: MutationRecord[]
    }
}

export interface CLRecord {
    tagName: string,
    attrs: string,
    parent: string,
    content: string,
    nodeType: number
}

export interface Record {
    target: string,
    oldAttr: string,
    newAttr: string,
    mutationType: number,
    added: CLRecord[],
    removed: CLRecord[]
}

export interface CLMutation {
    timestamp: number,
    records: Record[]
}

export interface EventListener {
    origin: Window | Document | HTMLElement,
    listener: string,
    handler: (event: Event) => boolean
};

export interface ErrorMessage {
    storage: string,
    observer: string
};