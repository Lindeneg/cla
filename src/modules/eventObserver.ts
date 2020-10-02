import {
    EventState,
    EventListener,
    Vector2D,
    EVENT
} from '../util/types';
import {
    MOUSE_MOVE_INTERVAL,
    MOUSE_MOVE_DIFF
} from '../util/constants';
import {
    createListeners,
    addEventListeners,
    removeEventListeners,
    tryGetNumber,
    getMouseEventType,
    getElementPath,
    getScrollLeft,
    getScrollTop,
    getWindowsSize,
    Logger
} from '../util/util';


export class EventObserver {

    readonly eventConfig: EventListener[];

    private _container: EventState[];
    private _lastMouseState: Vector2D;

    constructor(container: EventState[]) {

        Logger.log('initializing event observer');

        this.eventConfig = createListeners(this);
        this._container = container;
        this._lastMouseState = {
            x: 0,
            y: 0
        };
    }

    public handleEvent(event: Event): boolean {
        let shouldPush = true;
        if (event instanceof Event) {
            const et: string | number = tryGetNumber(event.type),
                lastEvent: EventState = this._container.length > 0 ? this._container[this._container.length - 1] : null,
                [w, h]: number[] = getWindowsSize();
            const eventState: EventState = {
                timestamp: new Date().getUTCMilliseconds(),
                // EventTarget !== HTMLElement -> but should be fine here
                //@ts-expect-error
                target: getElementPath(event.target),
                event: typeof et === 'string' ? getMouseEventType(et) : et,
                width: w,
                height: h,
                xd: getScrollLeft(),
                yd: getScrollTop()
            };
            if (event instanceof MouseEvent) {
                eventState.x = event.clientX + eventState.xd;
                eventState.y = event.clientY + eventState.yd;
                eventState.clickType = event.button;
            }
            switch (eventState.event) {
                case EVENT.MOUSE_MOVE:
                    if (lastEvent && lastEvent.event === EVENT.MOUSE_MOVE) {
                        shouldPush = this.handleMousemove(lastEvent, eventState);
                    }
                    break;
                case EVENT.MOUSE_DOWN:
                    if (lastEvent && lastEvent.event === EVENT.MOUSE_DOWN && eventState.timestamp - lastEvent.timestamp < MOUSE_MOVE_INTERVAL) {
                        shouldPush = false;
                    }
                    break;
                case EVENT.MOUSE_SCROLL:
                    if (lastEvent && lastEvent.event === EVENT.MOUSE_SCROLL) {
                        shouldPush = this.handleMouseScroll(lastEvent, eventState);
                    }
                    break;
                case EVENT.WINDOW_RESIZE:
                    if (lastEvent && lastEvent.event === EVENT.WINDOW_RESIZE) {
                        shouldPush = false;
                        this._container[this._container.length - 1] = eventState;
                    }
                    default:
                        break;
            }
            if (shouldPush) {
                Logger.log('handled event');
                Logger.log(eventState);
                this._container.push(eventState);
            }
            return shouldPush;
        }
        Logger.log('unable to handle event, invalid type');
        return false;
    }

    public start(): void {
        Logger.log('adding event observer listeners');
        addEventListeners(this.eventConfig);
    }

    public stop(): void {
        Logger.log('removing event observer listeners');
        removeEventListeners(this.eventConfig);
    }

    private handleMousemove(lastEvent: EventState, currentEvent: EventState): boolean {
        const dx = lastEvent.x - currentEvent.x,
            dy = lastEvent.y - currentEvent.y;
        const mouseState: Vector2D = {x: 0 ? 1 : -1, y: dy >= 0 ? 1 : -1};
        let shouldPush = true;
        if (Math.abs(dx) < MOUSE_MOVE_DIFF && Math.abs(dy) < MOUSE_MOVE_DIFF) {
            shouldPush = false;
        } else {
            if (mouseState.x !== this._lastMouseState.x || mouseState.y !== this._lastMouseState.y) {
                this._lastMouseState = mouseState;
            } else {
                shouldPush = false;
                this._container[this._container.length - 1] = currentEvent;
            }
        }
        return shouldPush;
    }

    private handleMouseScroll(lastEvent: EventState, currentEvent: EventState): boolean {
        let shouldPush: boolean = true;
        if (lastEvent.yd > currentEvent.yd) {
          currentEvent.scrollDirection = EVENT.MOUSE_SCROLL_UP;
        } else if (lastEvent.yd < currentEvent.yd) {
          currentEvent.scrollDirection = EVENT.MOUSE_SCROLL_DOWN;
        } else if (lastEvent.xd > currentEvent.xd) {
          currentEvent.scrollDirection = EVENT.MOUSE_SCROLL_LEFT;
        } else if (lastEvent.xd < currentEvent.xd) {
          currentEvent.scrollDirection = EVENT.MOUSE_SCROLL_RIGHT;
        }
        if (!(typeof lastEvent.scrollDirection === 'undefined') && lastEvent.scrollDirection === currentEvent.scrollDirection) {
          shouldPush = false;
          this._container[this._container.length - 1] = currentEvent;
        }
        return shouldPush;
    }
}