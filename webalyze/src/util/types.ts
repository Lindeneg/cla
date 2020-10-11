export enum MOVEMENT {
    STAYED_OUT,
    ENTERED,
    STAYED_IN,
    REPARENTED,
    REORDERED,
    EXITED
}

export enum EVENT {
    MOUSE_CLICK_PRIMARY,
    MOUSE_CLICK_MIDDLE,
    MOUSE_CLICK_RIGHT,
    MOUSE_CLICK_BACK,
    MOUSE_CLICK_FORWARD,
    MOUSE_SCROLL_UP,
    MOUSE_SCROLL_DOWN,
    MOUSE_SCROLL_LEFT,
    MOUSE_SCROLL_RIGHT,
    START,
    STOP,
    MOUSE_MOVE,
    MOUSE_DOWN,
    MOUSE_SCROLL,
    WINDOW_RESIZE,
    WINDOW_UNLOAD,
}

export interface StringMap < T > {
    [key: string]: T;
}

export interface NumberMap < T > {
    [key: number]: T;
}

export interface Vector2D {
    x: number;
    y: number;
}

export interface NodeData {
    id: number;
    nodeType ? : number;
    name ? : string;
    publicId ? : string;
    systemId ? : string;
    textContent ? : string;
    tagName ? : string;
    attributes ? : StringMap < string > ;
    childNodes ? : NodeData[];
}

export interface EventState {
    timestamp: number;
    target: string;
    event: number;
    width: number;
    height: number;
    xd: number;
    yd: number;
    x ? : number;
    y ? : number;
    scrollDirection ? : number;
    clickType ? : number;
}

export interface PositionData extends NodeData {
    previousSibling: NodeData;
    parentNode: NodeData;
}

export interface AttributeData extends NodeData {
    attributes: StringMap < string > ;
}

export interface TextData extends NodeData {
    textContent: string;
}

export interface TreeClientInitData {
    rootId: number;
    children: NodeData[];
}

export interface TreeClientChangedData {
    removed: NodeData[];
    changed: PositionData[];
    attrs: AttributeData[];
    text: TextData[];
}

export interface TreeClientCallbacks {
    init: (init: TreeClientInitData) => void;
    changed: (changed: TreeClientChangedData) => void;
}

export interface ObserverDomInit {
    timestamp: number;
    dom: TreeClientInitData;
    title: string;
    host: string;
    pathname: string;
    search: string;
    userAgent: string;
}

export interface ObserverDomChange {
    timestamp: number;
    dom: TreeClientChangedData;
}

export interface EventListener {
    origin: Window | Document | HTMLElement;
    listener: string;
    handler: (event: Event) => boolean;
}