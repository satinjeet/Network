import {Network, NetworkDriver, NetWorkQueueJob, OS} from "../base/os";
import {INetworkMedium} from "../../hardware/interfaces/INetworkMedium";
import {IDevice} from "../../hardware/interfaces/IDevice";
import {IPacket, Packet} from "../base/packet";
import {IDictionary} from "../../common/utils";

export class EthernetDriver implements NetworkDriver {
    type: string = "Ethernet";
    medium: INetworkMedium;
    jobQueue: IDictionary<NetWorkQueueJob> = {};
    connectedDevice: IDevice;
    myDevice: OS;

    private unresolvedPromise: Promise<any>;

    constructor(connectedDevice: IDevice, myDevice: OS, medium: INetworkMedium) {
        this.connectedDevice = connectedDevice;
        this.myDevice = myDevice;
        this.medium = medium;
    }

    signPacket(packet: IPacket): IPacket {
        packet = Object.assign(new Packet(), packet);
        packet.sender = this.myDevice.machine.id;
        packet.receiver = this.connectedDevice.id;
        return packet;
    }

    sendDataPacket(packet: IPacket): void {
        this.medium.signal(packet, this.connectedDevice);
    }

    receiveDataPacket(packet: IPacket): void {}

}