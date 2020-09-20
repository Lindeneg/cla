import {
    EventSummary
} from './modules/eventSummary';
import {
    errorMessage
} from './modules/constants';

class Webalyze {

    isRunning: boolean;
    start: () => void;
    stop: () => void;

    constructor() {
        let _eventSummary: EventSummary = new EventSummary({
            server: 'http://localhost:5000/api',
            token: ''
        });

        this.isRunning = false;

        this.start = (): void => {
            if (!this.isRunning) {
                this.isRunning = true;
                _eventSummary.start();
            }
        }

        this.stop = (): void => {
            if (this.isRunning) {
                this.isRunning = false;
                _eventSummary.stop();
            }
        }
    }
}

if (typeof globalThis.Storage === "undefined") {
    console.error(errorMessage.storage);
} else if (typeof globalThis.MutationObserver === "undefined") {
    console.error(errorMessage.observer);
} else {
    globalThis.Webalyze = new Webalyze();
}