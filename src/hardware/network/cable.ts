import {IDevice} from "../interfaces/IDevice";
import {Memory, World} from "../../index";
import {EVENTS} from "../../software/hwInterrupts/events";
import {Packet} from "../../software/base/os";
import {Subject} from "rxjs/Subject";
import {INetworkMedium} from "../interfaces/INetworkMedium";

export enum ConnectionType {
    ONE2ONE,
    ONE2MANY
}

export class Cable implements INetworkMedium {

    signal(data: Packet, device: IDevice) {
        this.medium.next(data);
    }

    devices: IDevice[] = [];
    inst: Snap.Element;
    limit: number = 2;
    private medium: Subject<Packet> = new Subject<Packet>();

    constructor() {
        Memory.add('pendingConnection', this);
        World.pendingConnection = true;
    }

    add(device: IDevice) {
        /**
         * check if this network can handle more devices,
         * if it can, try to connect
         */
        if (this.canHandleMoreDevices()) {

            /**
             * see if this device is already connected to this medium.
             * @type {IDevice[]}
             */
            let hasThisDeviceConnected = this.devices.filter((_device: IDevice) => {
                return device.id == _device.id;
            })

            if (hasThisDeviceConnected.length > 0) {
                return;
            }

            /**
             * otherwise connect to this network.
             */
            this.devices.push(device);
            this.medium.asObservable().subscribe((data: Packet) => {
                if (device.id == data.receiver)
                    device.interrupt(data.data);
            });
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
            this.devices.forEach((_device: IDevice) => {
                _device.connection.push(this);
                _device.interrupt(EVENTS.CONNECTION_ESTABLISHED);
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