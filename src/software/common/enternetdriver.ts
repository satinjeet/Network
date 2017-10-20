import {Network, NetworkDriver, Packet} from "../base/os";
import {NetworkMedium} from "../../hardware/network/cable";
import {Device} from "../../hardware/basic_box";

export class EthernetDriver implements NetworkDriver {
    connectedDevice: Device;
    myDevice: Device;

    private unresolvedPromise: Promise<any>;

    constructor(connectedDevice: Device, myDevice: Device, private medium: NetworkMedium) {
        this.connectedDevice = connectedDevice;
        this.myDevice = myDevice;
        this.medium.drivers[this.myDevice.id] = this;
    }

    signPacket(packet: Packet): Packet {
        packet = Object.assign({}, packet) as Packet;
        packet.sender = this.myDevice.id;
        packet.receiver = this.connectedDevice.id;
        return packet;
    }

    sendDataPacket(packet): Promise<any> {
        this.unresolvedPromise = new Promise((res, rej) => {
            /**
             * simulate connection for now.
             *
             * randomly respond to ping within 0.1 - 1 sec.
             */
            // let n = (Math.random() * 10 + 1) * 100;
            // setTimeout(() => {
            //     res({
            //         connected: true,
            //         pingTime: n
            //     });
            // }, n);

            /**
             * code actual connection
             */
            this.medium.signal(packet, this.connectedDevice);
        });

        return this.unresolvedPromise;
    }

    receiveDataPacket(packet: Packet) {
        console.log('Packet received', this.myDevice.id, packet);

        if (packet.data == "ping") {
            this.medium.signal(this.signPacket({
                data: 'ping received',
                sender: this.myDevice.id,
                receiver: this.connectedDevice.id
            } as Packet), this.connectedDevice);
        }

        if (packet.data == "ping received") {
            debugger
            if (this.unresolvedPromise) {
                Promise.resolve(this.unresolvedPromise);
                this.unresolvedPromise = undefined;
            }
        }
    }

}