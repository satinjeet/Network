import {Network, NetworkDriver, Packet} from "../base/os";
import {INetworkMedium} from "../../hardware/interfaces/INetworkMedium";
import {IDevice} from "../../hardware/interfaces/IDevice";

export class EthernetDriver implements NetworkDriver {
    connectedDevice: IDevice;
    myDevice: IDevice;

    private unresolvedPromise: Promise<any>;

    constructor(connectedDevice: IDevice, myDevice: IDevice, private medium: INetworkMedium) {
        this.connectedDevice = connectedDevice;
        this.myDevice = myDevice;
    }

    signPacket(packet: Packet): Packet {
        packet = Object.assign({}, packet) as Packet;
        packet.sender = this.myDevice.id;
        packet.receiver = this.connectedDevice.id;
        return packet;
    }

    sendDataPacket(packet): void {}

    receiveDataPacket(packet: Packet): void {}

}