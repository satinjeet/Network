import {OS_MODES} from "../os";
import {Device} from "../../hardware/basic_box";
import {DangerousHTML} from "../kernal/command";
import {NetworkMedium} from "../../hardware/network/cable";

export interface OS {
    gui: OSGUI;
    mode: OS_MODES;
    machine: Device;
    nmapTimer: any;

    commandReceived(command: string): DangerousHTML;

    display();

    console();

    /**
     * handle hardware interrupts
     */
    handlerInterrupt();
}

interface Packet {
    sender: string;
    receiver: string;

    data: any;
}

interface NetworkCard {
    sendDataPacket(packet, connection: NetworkMedium);

    receiveDataPacket(packet, connectionNetworkMedium);
}

export interface NetworkDriver {
    /**
     * OS implementing Network Driver will maintain a Network map of connected devices.
     */
    networkMap: {addr: string, device: Device}[];

    networkCards: NetworkCard[];

    createDataPacket(data: any);
}


export interface OSGUI {

}