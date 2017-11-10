import {IDevice} from "./IDevice";
import {IPacket} from "../../software/base/packet";

export interface INetworkMedium {
    devices: IDevice[];
    limit: number;

    canHandleMoreDevices(): boolean;

    add(device: IDevice);

    render();

    signal(data: IPacket, device: IDevice);
}