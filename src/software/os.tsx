import * as React from 'react';
import {Device} from "../hardware/basic_box";
import {DangerousHTML, Kernal} from "./kernal/command";
import {World} from "../index";
import {NetworkMedium} from "../hardware/network/cable";
import {Network, NetworkDriver, OS, Packet} from "./base/os";
import {EthernetDriver} from "./common/enternetdriver";
import {EVENTS} from "./hwInterrupts/events";

export enum OS_MODES {
    MODE_GUI,
    MODE_CONSOLE
}

export class BasicOS extends Kernal implements OS, Network {
    networkMap: { addr: string, driver: NetworkDriver }[] = [];

    gui: any;
    mode = OS_MODES.MODE_CONSOLE;
    ttyl:number = 60*1000;
    private ttylCache: number;

    constructor(public machine: Device) {
        super(():void => {
            this.nmap();
        });
        World.osLayer.addOs(this);
        this.ttylCache = this.ttyl;
    }

    commandReceived = (command: string): Promise<DangerousHTML> => {
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
                        driver: new EthernetDriver(_dev, this.machine, _connection)
                    })
                }
            })
        })
    }

    handlerInterrupt(intr: EVENTS) {
        console.log('revieved interrupt', intr);
        this.nmap(true);
    }

    createDataPacket(data: any): Packet {
        return {
            data,
            sender: undefined,
            receiver: undefined
        } as Packet;
    }
}