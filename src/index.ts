import {
    Observer
} from './modules/observer';


window['webalyzeDebug'] = 1;
setTimeout(() => {
    window['webalyzeObserver'] = new Observer(), window['webalyzeObserver'].start();
}, 500);