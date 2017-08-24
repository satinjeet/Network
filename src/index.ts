import {registerEvents} from "./events";
import * as Snap from 'snapsvg';



let l = Snap(window.innerWidth, window.innerHeight);

export class Memory {
    static mem = {};

    static add(id, value) {
        Memory.mem[id] = value;
    }

    static stage() {
        return l;
    }
}

export class World {
    static messageBox = undefined;

    static stage() {
        return l;
    }
}

Object.defineProperty(window, 'MemoryAPP', {value: Memory});
Object.defineProperty(window, 'World', {value: World});

registerEvents(l);

