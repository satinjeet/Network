import {OS_MODES} from "../os";
import {IDevice} from "../../hardware/interfaces/IDevice";
import {DangerousHTML} from "../kernal/command";
import {INetworkMedium} from "../../hardware/interfaces/INetworkMedium";
import {EVENTS} from "../hwInterrupts/events";
import {MessageDirection} from "./types";
import {IPacket, Packet} from "./packet";
import {IDictionary} from "../../common/utils";

export interface OS {
    gui: OSGUI;
    mode: OS_MODES;
    machine: IDevice;

    commandReceived(command: string): Promise<DangerousHTML>;

    display();

    console();

    /**
     * handle hardware interrupts
     */
    handlerInterrupt(intr: EVENTS);
}

export class NetWorkQueueJob {
    private _queue: any[] = [];
    private isComplete: boolean = false;

    public get Completed(): Boolean {
        return this.isComplete;
    }

    public set Job(job: any) {
        this._queue.push(job);
    }

    public Remove() {
        this._queue.pop();

        if (this._queue.length == 0) {
            this.isComplete = true;
        }
    }

}

export interface NetworkDriver {

    jobQueue: IDictionary<NetWorkQueueJob>;

    medium: INetworkMedium;

    type: string;

    signPacket(packet: IPacket): IPacket;

    sendDataPacket(packet: IPacket);

    receiveDataPacket(packet: IPacket);
}

export interface Network {
    /**
     * OS implementing Network Driver will maintain a Network map of connected devices.
     */
    networkMap: {addr: string, driver: NetworkDriver}[];

    createDataPacket(data: any): IPacket;

    recieveDataPacket(p: IPacket);
}


export interface OSGUI {

}