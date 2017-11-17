import {BasicOS} from "../../software/os";
import {INetworkMedium} from "./INetworkMedium";
import {EVENTS} from "../../software/hwInterrupts/events";
import {IPacket} from "../../software/base/packet";
import {IDefineType} from "./IDefineType";
import {OS} from "../../software/base/os";

export interface IDevice extends IDefineType {
    OS: OS;

    id: string;
    name: string;
    displayName: string;

    x: number;

    y: number;

    dx: number;
    dy: number;

    connection: INetworkMedium[];

    pauseEvent();

    readonly position: { x: number, y: number };

    interrupt(intr: EVENTS);

    readPacket(p: IPacket);
}