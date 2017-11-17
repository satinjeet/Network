import {World} from "../../index";
import {hasValue} from "../../common/utils";
import {Infobox} from "../views/infobox";
import {IDevice} from "../interfaces/IDevice";
import {IRedrawable} from "../interfaces/IRenderable";
import {BasicOS} from "../../software/os";
import {INetworkMedium} from "../interfaces/INetworkMedium";
import {EVENTS} from "../../software/hwInterrupts/events";
import {IPacket} from "../../software/base/packet";
import {OS} from "../../software/base/os";

export abstract class BasicDrawableClass implements IDevice, IRedrawable {
    update(): void {
        throw new Error("Method not implemented.");
    }

    OS: OS;
    id: string;
    name: string;
    displayName: string;
    x: number;
    y: number;
    dx: number;
    dy: number;

    connection: INetworkMedium[];

    pauseEvent() {
        throw new Error("Method not implemented.");
    }

    position: { x: number; y: number; };

    interrupt(intr: EVENTS) {
        throw new Error("Method not implemented.");
    }

    readPacket(p: IPacket) {
        throw new Error("Method not implemented.");
    }

    type: string;
    public inst: Snap.Element;

    render(): void {
        let showStatus: boolean = false;
        let statusBox: Infobox = undefined;

        let rect = World.stage().rect(this.x, this.y, 100, 50);
        rect.attr({stroke: '#C7C7C7', strokeWidth: 2, fill: "#CACACA"});

        let light = World.stage().circle(this.x + 5, this.y + 25, 3);
        light.attr({stroke: '#AA55AA', strokeWidth: 1, fill: '#55FF55'});
        this.inst = World.stage().group(rect, light);

        this.inst.mouseover((e: MouseEvent) => {
            showStatus = true;
            if (statusBox) return;

            statusBox = new Infobox(this, e.clientX, e.clientY);
            statusBox.render();
        });
        this.inst.mouseout((e: MouseEvent) => {
            showStatus = false;
            statusBox.destroy();
            statusBox = undefined;
        });

        this.inst.mousemove((e: MouseEvent) => {
            if (!showStatus) {
                return;
            }
            statusBox.move(e.clientX, e.clientY);
        })

        this.inst.drag(this.move, this.start, this.stop);
    }

    move = (dx, dy) => {
        if (this.pauseEvent()) return;
        this.dx = dx;
        this.dy = dy;
        this.inst.attr({
            transform: this.inst.data('origTransform') + (this.inst.data('origTransform') ? "T" : "t") + [dx, dy]
        });
        this.update();
    }

    start = () => {
        if (this.pauseEvent()) return;
        this.inst.data('origTransform', this.inst.transform().local);
    }

    stop = () => {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;

        this.dx = 0;
        this.dy = 0;
    }
}