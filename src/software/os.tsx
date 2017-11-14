import * as React from 'react';
import {IDevice} from "../hardware/interfaces/IDevice";
import {DangerousHTML, Kernal} from "./kernal/command";
import {World} from "../index";
import {INetworkMedium} from "../hardware/interfaces/INetworkMedium";
import {Network, NetworkDriver, OS } from "./base/os";
import {EthernetDriver} from "./common/enternetdriver";
import {EVENTS} from "./hwInterrupts/events";
import {IPacket, Packet, PacketTypePing} from "./base/packet";
import {MessageDirection} from "./base/types";

export enum OS_MODES {
    MODE_GUI,
    MODE_CONSOLE
}

export class BasicOS extends Kernal implements OS, Network {
    recieveDataPacket(p: IPacket) {
        let nmap = this.networkMap.find(dr => dr.addr == p.sender);

        if (p.direction == MessageDirection.FROM) {
            console.log('I got ping', p);
            let p_ = new Packet();
            p_.type = new PacketTypePing();
            p_.data = p.data;
            p_.direction = MessageDirection.TO;

            p = nmap.driver.signPacket(p_);
            nmap.driver.sendDataPacket(p_);
        }
    }

    networkMap: { addr: string, driver: NetworkDriver }[] = [];

    gui: any;
    mode = OS_MODES.MODE_CONSOLE;
    ttyl:number = 60*1000;
    private ttylCache: number;

    constructor(public machine: IDevice) {
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
        let devList = this.machine.connection.map((_connection: INetworkMedium) => {
            _connection.devices.map((_dev: IDevice) => {
                if (_dev.id != this.machine.id) {
                    this.networkMap.push({
                        addr: _dev.id,
                        driver: new EthernetDriver(_dev, this, _connection)
                    })
                }
            })
        })
    }

    handlerInterrupt(intr: EVENTS) {
        console.log('received interrupt', intr);

        switch (intr) {
            case EVENTS.CONNECTION_ESTABLISHED:
                this.nmap(true);
                break;
            case EVENTS.PING_REQUESTED:
                break;
            case EVENTS.PING_RESPONSE:
                break;
        }
    }

    createDataPacket(data: any): IPacket {
        return {
            data,
            sender: undefined,
            receiver: undefined
        } as IPacket;
    }
}