import * as React from 'react';
import {Device} from "../hardware/basic_box";
import {DangerousHTML, Kernal} from "./kernal/command";
import {World} from "../index";
import {NetworkDriver, OS} from "./base/os";
import {NetworkMedium} from "../hardware/network/cable";

export enum OS_MODES {
    MODE_GUI,
    MODE_CONSOLE
}

export class BasicOS extends Kernal implements OS {
    gui: any;
    mode = OS_MODES.MODE_CONSOLE;
    nmapTimer: any;
    ttyl:number =  5*1000;
    private ttylCache: number;

    constructor(public machine: Device) {
        super();
        World.osLayer.addOs(this);
        this.ttylCache = this.ttyl;
    }

    commandReceived = (command: string): DangerousHTML => {
        console.log('Received Command : ', command);
        return this.execute(command);
    }

    display() {
        this.console();
    }

    console() {
        this.gui.open();
    }

    tick = ():void => {
        // this.nmap();
    }

    // nmap() {
    //     this.ttylCache -= this.tickTimer;
    //
    //     if (this.ttylCache > 0) {
    //         return;
    //     }
    //
    //
    //     this.ttylCache = this.ttyl;
    //     let devList = this.machine.connection.map((_connection: NetworkMedium) => {
    //         return _connection.devices.filter((_dev: Device) => {
    //             return _dev.id != this.machine.id;
    //         })
    //     })
    //
    //     console.log(devList);
    // }
}