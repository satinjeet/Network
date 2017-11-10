import {OS_MODES} from "../os";
import {IDevice} from "../../hardware/interfaces/IDevice";
import {DangerousHTML} from "../kernal/command";
import {INetworkMedium} from "../../hardware/interfaces/INetworkMedium";
import {EVENTS} from "../hwInterrupts/events";
import {MessageDirection} from "./types";

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

export interface NetworkDriver {

    signPacket(packet: Packet): Packet;

    sendDataPacket(packet);

    receiveDataPacket(packet);
}

export interface Network {
    /**
     * OS implementing Network Driver will maintain a Network map of connected devices.
     */
    networkMap: {addr: string, driver: NetworkDriver}[];

    createDataPacket(data: any): Packet;
}


export interface OSGUI {

}