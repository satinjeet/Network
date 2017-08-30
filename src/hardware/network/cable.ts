import {Device} from "../basic_box";
import {Memory, World} from "../../index";

export enum ConnectionType {
    ONE2ONE,
    ONE2MANY

}

export interface NetworkMedium {
    devices: Device[];
    limit: number;

    canHandleMoreDevices(): boolean;

    add(device: Device);

    render();
}

export class Cable implements NetworkMedium {

    devices: Device[] = [];
    inst: Snap.Element;
    limit: number = 2;

    constructor() {
        Memory.add('pendingConnection', this);
        World.pendingConnection = true;
    }

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
        if (this.devices.length == this.limit) {
            /**
             * let the world know that connection is established
             * @type {boolean}
             */
            World.pendingConnection = false;
            World.messageBox.setMessage('Cable Connected');

            /**
             * internal:
             *
             * remove buffer connection
             * and add actual Cable connection
             */
            Memory.remove('pendingConnection');
            Memory.add(`Cable-${Memory.getId()}`, this);

            /**
             * register connection to each device.
             */
            this.devices.forEach((_device: Device) => {
                _device.connection.push(this);
                _device.interrupt();
            })
            this.render();
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
        if (this.inst) this.inst.remove();

        this.inst = Memory.stage().line(this.devices[0].position.x, this.devices[0].position.y, this.devices[1].position.x, this.devices[1].position.y);
        this.inst.attr({ stroke: '#000', strokeWidth: '2'})
    }

}