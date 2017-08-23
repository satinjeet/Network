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
        /**
         * check if this network can handle more devices,
         * if it can, try to connect
         */
        if (this.canHandleMoreDevices()) {

            /**
             * see if this device is already connected to this medium.
             * @type {Device[]}
             */
            let hasThisDeviceConnected = this.devices.filter((_device: Device) => {
                return device.id == _device.id;
            })

            if (hasThisDeviceConnected.length > 0) {
                return;
            }

            /**
             * otherwise connect to this network.
             */
            this.devices.push(device);
        }

        /**
         * render condition for cable
         * TO-DO: try to render a dummy cable
         */
        this.render();
    }

    canHandleMoreDevices(): boolean {
        if (this.devices.length > this.limit) {
            return false;
        } else {
            return true;
        }
    }

    render() {

        if (this.devices.length == this.limit) {
            if (this.inst) this.inst.remove();
            document.removeEventListener('mousemove', this.renderTempState);
            this.inst = Memory.stage().line(this.devices[0].x, this.devices[0].y, this.devices[1].x, this.devices[1].y);
            this.inst.attr({ stroke: '#000', strokeWidth: '2'})
        } else {
            console.log('Register temp cable')
            document.addEventListener('mousemove', this.renderTempState);
        }
    }

    renderTempState = (e: MouseEvent) => {
        console.log('Render wire at ', e.clientX, e.clientY, this.devices[0].x, this.devices[0].y);
        if (this.inst) this.inst.remove();
        /**
         * TO-DO : figure out how to keep the wire out of the way.
         * @type {Snap.Element}
         */
        this.inst = Memory.stage().line(this.devices[0].x, this.devices[0].y, e.clientX, e.clientY);
        this.inst.attr({ stroke: '#A1A1A1', strokeWidth: '1'})
    }

}