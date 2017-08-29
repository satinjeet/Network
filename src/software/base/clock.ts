import {World} from "../../index";

interface Clocked {
    tick(): void;
}

export abstract class TimedTasks implements Clocked {
    protected tickState: any;
    protected tickTimer: number = 100;

    constructor() {
        this.tickState = setInterval(this.tick, this.tickTimer);
    }

    tick = ():void => {
        clearInterval(this.tickState);
        World.messageBox.setMessage("Tick function needs to be implemented for the OS");
        throw new Error("Tick function needs to be overriden");
    }
}