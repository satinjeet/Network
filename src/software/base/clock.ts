import {World} from "../../index";

let tickNotImplemented = function (): void {
    clearInterval(this.tickState);
    World.messageBox.setMessage("Tick function needs to be implemented for the OS");
    throw new Error("Tick function needs to be overriden");
}


interface Clocked {
    tick(): void;
}

export abstract class TimedTasks implements Clocked {
    protected tickState: any;
    protected tickTimer: number = 100;
    public tick = tickNotImplemented;

    constructor(tick) {
        this.tick = tick;
        this.tick.bind(this);
        this.tickState = setInterval(this.tick, this.tickTimer);
    }
}