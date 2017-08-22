import {Device} from "../basic_box";
import {Memory} from "../../index";

export enum ConnectionType {
    ONE2ONE,
    ONE2MANY

}

export interface NetworkMedium {
    devices: Device[];
    limit: number;

    canHandleMoreDevices(): boolean;

    add(device: Device);
}

export class Cable implements NetworkMedium {

    devices: Device[] = [];
    inst: Snap.Element;
    limit: number = 2;

    add(device: Device) {
        if (this.canHandleMoreDevices()) {
            this.devices.push(device);
        }

        if (this.devices.length == this.limit) {
            this.render()
        }
    }

    canHandleMoreDevices(): boolean {
        if (this.devices.length > this.limit) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        this.inst = Memory.stage().line(this.devices[0].x, this.devices[0].y, this.devices[1].x, this.devices[1].y);
        this.inst.attr({ stroke: '#000', strokeWidth: '2'})
    }

}