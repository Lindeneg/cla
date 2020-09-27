export const NAMED_EVENTS: string[] = ["mousemove", "mousedown", "scroll", "resize", "unload"];
export const MUTATION_SUMMARY_ID_PROP: string = '__webalyze_node_map_id__';
export const B64_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export const MOUSE_MOVE_INTERVAL: number = 1000;
export const MOUSE_MOVE_DIFF: number = 10;
export const errorMessage: {
    storage: string,
    observer: string
} = {
    storage: 'Session Storage is a required for Webalyze\nhttps://developer.mozilla.org/en-US/docs/Web/API/Storage',
    observer: 'Mutation Observers are a required for Webalyze\nhttps://developer.mozilla.org/en-US/docs/Web/API/MutationObserver'
  }