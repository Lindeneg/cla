import {
    EventSummary
} from './modules/summary';
import {
    errorMessage
} from './modules/constants';

class Cla {

    start: () => void;
    stop: () => void;

    constructor() {
        let _eventSummary: Cla = new EventSummary({
            server: 'http://localhost:5000/api',
            token: ''
        });

        this.start = (): void => {
            _eventSummary.start();
        }

        this.stop = (): void => {
            _eventSummary.stop();
        }
    }
}

if (typeof globalThis.Storage === "undefined") {
    console.error(errorMessage.storage);
} else if (typeof globalThis.MutationObserver === "undefined") {
    console.error(errorMessage.observer);
} else {
    globalThis.Cla = new Cla();
}