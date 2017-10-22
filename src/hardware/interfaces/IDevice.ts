import {BasicOS} from "../../software/os";
import {INetworkMedium} from "./INetworkMedium";
import {EVENTS} from "../../software/hwInterrupts/events";
import {Packet} from "../../software/base/os";

export interface IDevice {
    OS: BasicOS;

    id: string;
    name: string;

    x: number;

    y: number;

    dx: number;
    dy: number;

    connection: INetworkMedium[];

    pauseEvent();

    readonly position: { x: number, y: number };

    interrupt(intr: EVENTS);

    SignalIn(packet: Packet);
}