import {
  ErrorMessage,
  EVENT_TYPE
} from './types';

export const G_WIN: Window = globalThis.window;
export const G_DOC: Document = globalThis.window.document;
export const NAMED_EVENTS: string[] = ["mousemove", "mousedown", "scroll", "resize", "unload"];
export const B64_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const B64_SLICE_RANGE: number = 3;
export const MUTATION_SUMMARY_ID_PROP: string = '__cl_webalyze_node_map_id__';
export const MUTATION_QUERIES: {
  all: boolean
} [] = [{
  all: true
}];
export const OFFLOAD_INTERVAL: number = 10000;
export const MOUSE_MOVE_INTERVAL: number = 1000;
export const MUTATION_TYPE: {
  childList: number,
  attributes: number
} = {
  childList: EVENT_TYPE.MUTATION_CHILDLIST,
  attributes: EVENT_TYPE.MUTATION_ATTRIBUTE
};
export const MOUSE_MOVE_DIFF: number = 10;
export const STRINGIFY_DELIMITER: string = '|';
export const STRINGIFY_EOF: string = '}';
export const errorMessage: ErrorMessage = {
  storage: 'Session Storage is a required for Webalyze\nhttps://developer.mozilla.org/en-US/docs/Web/API/Storage',
  observer: 'Mutation Observers are a required for Webalyze\nhttps://developer.mozilla.org/en-US/docs/Web/API/MutationObserver'
}