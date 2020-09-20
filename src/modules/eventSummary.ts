import {
    EVENT_TYPE,
    ClEventState,
    CLMutation,
    MutationEvent,
    EventListener,
    Record
  } from './types';
  import {
    OFFLOAD_INTERVAL,
    MOUSE_MOVE_INTERVAL,
    MOUSE_MOVE_DIFF,
    STRINGIFY_DELIMITER,
    STRINGIFY_EOF,
    MUTATION_QUERIES,
    MUTATION_TYPE,
    G_WIN,
    G_DOC
  } from './constants';
  import {
    getNewEventState,
    getNewMutationEvent,
    getNewRecord,
    getMouseEventType,
    getNodeChanges,
    isNumber,
    addEventListeners,
    removeEventListeners,
    getWindowsSize,
    getScrollTop,
    getScrollLeft,
    tryGetNumber,
    createListeners,
    encodeB64,
    stringifyObject,
    getElementPath,
    getAttrs
  } from './util';
  import {
    Vector
  } from './vector';
  import {
    MutationSummary
  } from './mutations';
  
  const log = (msg: string): void => {
    console.log(new Date().getTime() + ': ' + msg);
  }
  
  export class EventSummary {
  
    private server: string;
    private token: string;
    private pathname: string;
    private lastMouseState: Vector;
    private interval: number | null;
    private mutationSummary: MutationSummary;
    private listeners: EventListener[];
    private mutations: CLMutation[];
    private events: ClEventState[];
  
    constructor(config: {server: string, token: string}) {
  
      this.server = config.server;
      this.token = config.token;
      this.pathname = G_DOC.location.pathname;
      this.lastMouseState = Vector.zero();
      this.interval = null;
      this.mutationSummary = new MutationSummary({
        callback: this.handleMutationEvent.bind(this),
        queries: MUTATION_QUERIES
      });
      this.mutationSummary.disconnect();
      this.listeners = createListeners(this);
      this.events = [], this.mutations = [];
    }
  
    public start(): void {
      this.handleEvent(new Event('' + EVENT_TYPE.CLWA_INIT));
    }
  
    public stop(): void {
      this.handleEvent(new Event('' + EVENT_TYPE.CLWA_STOP));
    } 
  
    public handleEvent(event: Event): boolean {
      // TODO check previous pathname, if match ignore else update
      if (event instanceof Event) {
        const state: ClEventState = getNewEventState(),
          et = tryGetNumber(event.type);
        const eventType: number = typeof et === 'string' ? getMouseEventType(et) : et;
        const hasEvents: boolean = this.events.length > 0;
        const lastEvent: ClEventState | null = hasEvents ? this.events[this.events.length - 1] : null;
        let callback: () => void = null,
          shouldPush: boolean = true;
        if (isNumber(eventType)) {
          state.event = eventType;
          [state.width, state.height] = getWindowsSize();
          [state.top, state.left] = [getScrollTop(), getScrollLeft()];
          // @ts-ignore
          state.target = getElementPath(event.target);
          if (eventType === EVENT_TYPE.CLWA_INIT) {
            shouldPush = this.handleInit();
            state.pathname = this.pathname;
          } else if (eventType === EVENT_TYPE.CLWA_STOP) {
            shouldPush = this.handleCease();
          } else {
            if (event instanceof MouseEvent) {
              state.x = event.clientX + state.left;
              state.y = event.clientY + state.top;
              state.clickType = event.button;
            }
            switch (state.event) {
              case EVENT_TYPE.MOUSE_MOVE:
                if (lastEvent && lastEvent.event === EVENT_TYPE.MOUSE_MOVE) {
                  shouldPush = this.handleMouseMove(lastEvent, state);
                }
                break;
              case EVENT_TYPE.MOUSE_DOWN:
                if (lastEvent && lastEvent.event === EVENT_TYPE.MOUSE_DOWN && state.timestamp - lastEvent.timestamp < MOUSE_MOVE_INTERVAL) {
                  shouldPush = false;
                }
                break;
              case EVENT_TYPE.MOUSE_SCROLL:
                if (lastEvent && lastEvent.event === EVENT_TYPE.MOUSE_SCROLL) {
                  shouldPush = this.handleMouseScroll(lastEvent, state);
                }
                break;
  
              case EVENT_TYPE.WINDOW_RESIZE:
                if (lastEvent && lastEvent.event === EVENT_TYPE.WINDOW_RESIZE) {
                  shouldPush = false;
                  this.events[this.events.length - 1] = state;
                }
                break;
  
              case EVENT_TYPE.WINDOW_UNLOAD:
                callback = this.offloadData;
                break;
  
              default:
                break;
            }
          }
          if (shouldPush) {
            log('handled event');
            console.log(state);
            this.events.push(state);
          }
          typeof callback === 'function' ? callback() : null;
          return true;
        }
      }
      return false;
    }
  
    public handleMutationEvent(event: MutationEvent[]): void {
      const state: CLMutation = getNewMutationEvent();
      for (let i: number = 0; i < event.length; i++) {
        for (let j: number = 0; j < event[i].projection.mutations.length; j++) {
          const mutation: MutationRecord = event[i].projection.mutations[j];
          const mutationType: number = MUTATION_TYPE[mutation.type];
          if (typeof mutationType !== 'undefined') {
            const record: Record = getNewRecord();
            record.target = getElementPath(mutation.target), record.mutationType = mutationType;
            if (mutationType === MUTATION_TYPE.attributes) {
              // @ts-ignore
              record.newAttr = mutation.attributeName + '=' + mutation.target.getAttribute(mutation.attributeName);
              record.oldAttr = mutation.attributeName + '=' + mutation.oldValue;
              if (record.newAttr === record.oldAttr) {
                continue;
              }
            }
            [record.added, record.removed] = getNodeChanges(mutation.addedNodes, mutation.removedNodes);
            state.records.push(record);
          }
        }
      }
      log('handled mutations');
      console.log(state);
      this.mutations.push(state);
    }
  
    private handleInit(): boolean {
      log('init EventSummary');
      if (this.interval === null) {
        this.interval = setInterval(this.intervalOffload.bind(this), OFFLOAD_INTERVAL);
      }
      if (!(this.mutationSummary.isConnected())) {
        this.mutationSummary.reconnect();
      }
      this.addListeners();
      return true;
    }
  
    private handleCease(): boolean {
      log('stop EventSummary');
      if (this.interval !== null) {
        clearInterval(this.interval);
        this.interval = null;
      }
      if (this.mutationSummary.isConnected()) {
        this.mutationSummary.disconnect();
      }
      this.removeListeners();
      G_WIN.sessionStorage._webalyzeStoredEventState = '';
      return true;
    }
  
    private handleMouseMove(lastEvent: ClEventState, state: ClEventState): boolean {
      const dx = lastEvent.x - state.x,
        dy = lastEvent.y - state.y;
      const mouseState = new Vector(dx >= 0 ? 1 : -1, dy >= 0 ? 1 : -1);
      let shouldPush = true;
      if (Math.abs(dx) < MOUSE_MOVE_DIFF && Math.abs(dy) < MOUSE_MOVE_DIFF) {
        shouldPush = false;
      } else {
        if (mouseState.x !== this.lastMouseState.x || mouseState.y !== this.lastMouseState.y) {
          this.lastMouseState = mouseState;
        } else {
          shouldPush = false;
          this.events[this.events.length - 1] = state;
        }
      }
      return shouldPush;
    }
  
    private handleMouseScroll(lastEvent: ClEventState, state: ClEventState): boolean {
      let shouldPush: boolean = true;
      if (lastEvent.top > state.top) {
        state.scrollDirection = EVENT_TYPE.MOUSE_SCROLL_UP;
      } else if (lastEvent.top < state.top) {
        state.scrollDirection = EVENT_TYPE.MOUSE_SCROLL_DOWN;
      } else if (lastEvent.left > state.left) {
        state.scrollDirection = EVENT_TYPE.MOUSE_SCROLL_LEFT;
      } else if (lastEvent.left < state.left) {
        state.scrollDirection = EVENT_TYPE.MOUSE_SCROLL_RIGHT;
      }
      if (!(lastEvent.scrollDirection === EVENT_TYPE.DEFAULT_EVENT_STATE) && lastEvent.scrollDirection === state.scrollDirection) {
        shouldPush = false;
        this.events[this.events.length - 1] = state;
      }
      return shouldPush;
    }
  
    private pushToStorage(): void {
      G_WIN.sessionStorage._webalyzeStoredEventState = this.stringifyEvents();
      G_WIN.sessionStorage._webalyzeStoredMutationState = this.stringifyMutations();
    }
  
    private intervalOffload(): boolean {
      if (this.events.length > 0 || this.mutations.length > 0) {
        this.pushToStorage();
        return this.offloadData();
      }
      return false;
    }
  
    private offloadData(): boolean {
      const events: string = encodeB64(G_WIN.sessionStorage._webalyzeStoredEventState);
      const mutations: string = encodeB64(G_WIN.sessionStorage._webalyzeStoredMutationState)
      this.lastMouseState = Vector.zero();
      this.events.length = 0;
      this.mutations.length = 0;
      G_WIN.sessionStorage._webalyzeStoredEventState = '';
      G_WIN.sessionStorage._webalyzeStoredMutationState = '';
      return this.offloadDataString('events', events) || this.offloadDataString('mutations', mutations);
    }
  
    private offloadDataString(eventType, data: string): boolean {
      if (eventType && data && this.server && this.token) {
        const img: HTMLImageElement = new Image();
        img.src = this.server + '?' + eventType + '=' + data + '&token=' + this.token;
        return true;
      }
      return false;
    }
  
    private stringifyEvents(): string {
      let result: string = '';
      for (let i: number = 0; i < this.events.length; i++) {
        const evt: ClEventState = this.events[i],
          keys: string[] = Object.keys(evt);
        let tmp: string = '';
        for (let j: number = 0; j < keys.length; j++) {
          const key = keys[j].length > 1 ? keys[j].slice(0, 2) : keys[j];
          tmp += key + '=' + evt[keys[j]] + STRINGIFY_DELIMITER;
        }
        result += tmp + STRINGIFY_EOF;
      }
      return result;
    }
  
    private stringifyMutations(): string {
      let result: string = '';
      for (let i: number = 0; i < this.mutations.length; i++) {
        result += JSON.stringify(this.mutations[i]) + STRINGIFY_DELIMITER;
      }
      result += STRINGIFY_EOF;
      return result;
    }
  
    private addListeners(): boolean {
      return addEventListeners(this.listeners);
    }
  
    private removeListeners(): boolean {
      return removeEventListeners(this.listeners);
    }
  }