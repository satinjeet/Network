import {registerEvents} from "./events";
import * as Snap from 'snapsvg';
import {Messagebox} from "./appui/messagebox";

let l = Snap(window.innerWidth, window.innerHeight);

export class Memory {
    static mem = {};
    static objCounter: number = 0;

    static add(id, value) {
        Memory.mem[id] = value;
    }

    static remove(id) {
        delete Memory.mem[id];
    }

    static stage() {
        return l;
    }

    static getId() {
        return ++Memory.objCounter;
    }
}

export class World {
    static messageBox: Messagebox = undefined;
    static osLayer = undefined;
    
    static pendingConnection: boolean = false;

    static stage() {
        return l;
    }
}

Object.defineProperty(window, 'Memory', {value: Memory});
Object.defineProperty(window, 'World', {value: World});

registerEvents(l);

