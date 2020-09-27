export enum MOVEMENT {
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

export interface Vector2D {
    x: number,
    y: number
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
    rootId: number,
    children: NodeData[]
}

export interface TreeClientChangedData {
    removed: NodeData[],
    changed: PositionData[],
    attrs: AttributeData[],
    text: TextData[]
}

export interface TreeClientCallbacks {
    init: (init: TreeClientInitData) => void,
    changed: (changed: TreeClientChangedData) => void
}

export interface ObserverDomInit {
    timestamp: number,
    dom: TreeClientInitData,
    title: string,
    host: string,
    pathname: string,
    search: string,
    userAgent: string
}

export interface ObserverDomChange {
    timestamp: number,
    dom: TreeClientChangedData,
}

export interface EventListener {
    origin: Window | Document | HTMLElement,
    listener: string,
    handler: (event: Event) => boolean
}
