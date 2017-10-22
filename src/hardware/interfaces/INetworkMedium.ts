import {IDevice} from "./IDevice";
import {Packet} from "../../software/base/os";

export interface INetworkMedium {
    devices: IDevice[];
    limit: number;

    canHandleMoreDevices(): boolean;

    add(device: IDevice);

    render();

    signal(data: Packet, device: IDevice);
}