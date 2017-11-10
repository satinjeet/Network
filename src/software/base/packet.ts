import {MessageDirection} from "./types";
import {hasValue} from "../../common/utils";

export interface IPacketTypes {
    name: string
}

export class PacketTypePing implements  IPacketTypes {
    name: string = "ping";
}

export interface IPacket {
    sender: string;
    receiver: string;

    data: any;
    type: IPacketTypes;
    direction: string;

    isValid(): boolean;
}

export class Packet implements IPacket {
    sender: string;
    receiver: string;

    data: any;
    type: IPacketTypes;
    direction: string;

    isValid(): boolean {
        if (this.direction !== MessageDirection.FROM || this.direction !== MessageDirection.TO) {
            throw new Error("Invalid message direction");
        }

        if (!hasValue(this.sender)) {
            throw new Error("Invalid sender");
        }

        if (!hasValue(this.receiver)) {
            throw new Error("Invalid receiver");
        }

        if (!(hasValue(this.type) && hasValue(this.type.name))) {
            throw new Error("Invalid packet type");
        }

        return true;
    }


}