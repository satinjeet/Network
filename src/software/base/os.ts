import {OS_MODES} from "../os";
import {Device} from "../../hardware/basic_box";
import {DangerousHTML} from "../kernal/command";
import {NetworkMedium} from "../../hardware/network/cable";
import {EVENTS} from "../hwInterrupts/events";

export interface OS {
    gui: OSGUI;
    mode: OS_MODES;
    machine: Device;

    commandReceived(command: string): Promise<DangerousHTML>;

    display();

    console();

    /**
     * handle hardware interrupts
     */
    handlerInterrupt(intr: EVENTS);
}

export interface Packet {
    sender: string;
    receiver: string;

    data: any;
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