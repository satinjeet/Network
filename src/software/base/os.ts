import {OS_MODES} from "../os";
import {Device} from "../../hardware/basic_box";
import {DangerousHTML} from "../kernal/command";

export interface OS {
    gui: OSGUI;
    mode: OS_MODES;
    machine: Device;
    nmapTimer: any;

    commandReceived(command: string): DangerousHTML;

    display();

    console();
}

export interface NetworkDriver {
    networkMap: {addr: string, device: Device}[];
}


export interface OSGUI {

}