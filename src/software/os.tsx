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

export class BasicOS extends Kernal implements OS, NetworkDriver {
    networkMap: { addr: string; device: Device; }[] = [];
    gui: any;
    mode = OS_MODES.MODE_CONSOLE;
    nmapTimer: any;
    ttyl:number = 60*1000;
    private ttylCache: number;

    constructor(public machine: Device) {
        super(():void => {
            this.nmap();
        });
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

    nmap(force: boolean = false) {
        this.ttylCache -= this.tickTimer;

        if (this.ttylCache > 0 && !force) {
            return;
        }

        this.ttylCache = this.ttyl;
        this.networkMap = [];
        let devList = this.machine.connection.map((_connection: NetworkMedium) => {
            _connection.devices.map((_dev: Device) => {
                if (_dev.id != this.machine.id) {
                    this.networkMap.push({
                        addr: _dev.id,
                        device: _dev
                    })
                }
            })
        })
    }

    handlerInterrupt() {
        this.nmap(true);
    }
}