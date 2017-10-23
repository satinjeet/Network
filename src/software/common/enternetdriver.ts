import {Network, NetworkDriver, OS, Packet} from "../base/os";
import {INetworkMedium} from "../../hardware/interfaces/INetworkMedium";
import {IDevice} from "../../hardware/interfaces/IDevice";

export class EthernetDriver implements NetworkDriver {
    connectedDevice: IDevice;
    myDevice: OS;

    private unresolvedPromise: Promise<any>;

    constructor(connectedDevice: IDevice, myDevice: OS, private medium: INetworkMedium) {
        this.connectedDevice = connectedDevice;
        this.myDevice = myDevice;
    }

    signPacket(packet: Packet): Packet {
        packet = Object.assign({}, packet) as Packet;
        packet.sender = this.myDevice.machine.id;
        packet.receiver = this.connectedDevice.id;
        return packet;
    }

    sendDataPacket(packet): void {
        this.medium.signal(packet, this.connectedDevice);
    }

    receiveDataPacket(packet: Packet): void {}

}