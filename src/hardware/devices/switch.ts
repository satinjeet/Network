import {IDevice} from "../interfaces/IDevice";
import {INetworkMedium} from "../interfaces/INetworkMedium";
import {EVENTS} from "../../software/hwInterrupts/events";
import {IPacket} from "../../software/base/packet";
import {BasicOS} from "../../software/os";
import {BasicDrawableClass} from "./_basic.drawable.device";
import {OS} from "../../software/base/os";

export class Switch extends BasicDrawableClass {
    inst: Snap.Element;
    OS: OS;
    id: string;
    name: string;
    displayName: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    connection: INetworkMedium[];
    position: { x: number; y: number };
    type: string;

    pauseEvent() {
    }

    interrupt(intr: EVENTS) {
    }

    readPacket(p: IPacket) {
    }

    update(): void {
    }
}