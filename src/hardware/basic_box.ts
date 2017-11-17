import {BasicOS} from "../software/os";
import {generateHDWId, getRandomName} from "./utility/utils";
import {Memory, World} from "../index";
import {Cable} from "./network/cable";
import {EVENTS} from "../software/hwInterrupts/events";
import {IDevice} from "./interfaces/IDevice";
import {INetworkMedium} from "./interfaces/INetworkMedium";
import {IPacket} from "../software/base/packet";
import {IRedrawable, IRenderable} from "./interfaces/IRenderable";
import {hasValue} from "../common/utils";
import {Infobox} from "./views/infobox";
import {Network, OS} from "../software/base/os";

export class BasicBox implements IDevice, IRedrawable {

    public OS: OS;
    public id: string = generateHDWId();
    public name: string = getRandomName();
    public displayName: string = this.name;
    public connection: INetworkMedium[] = [];
    public dx: number = 0;
    public dy: number = 0;
    public type: string = "Basic Box";

    public inst: Snap.Element;

    constructor(private stage: Snap.Paper, public x: number, public y: number) {
        this.render();
        this.OS = new BasicOS(this);

        Memory.add(this.id, this);
    }

    get position(): {x: number, y: number} {
        return {
            x: this.x + this.dx,
            y: this.y + this.dy
        }
    }

    set position(args) {
        throw new Error('Position in read only')
    }

    render() {
        let showStatus = false;
        let statusBox = undefined;
        let cable: Cable;

        let rect = World.stage().rect(this.x, this.y, 100, 50);
        rect.attr({stroke: '#C7C7C7', strokeWidth: 2, fill: "#CACACA"});

        let light = World.stage().circle(this.x + 5, this.y + 25, 3);
        light.attr({stroke: '#AA55AA', strokeWidth: 1, fill: '#55FF55'});
        this.inst = World.stage().group(rect, light);

        this.inst.node.addEventListener('contextmenu', (e: MouseEvent) => {
            if (this.pauseEvent()) return;
            e.stopPropagation();
            e.preventDefault();
            this.OS.display();
        })

        this.inst.click((e) => {
            e.preventDefault();
            e.stopPropagation();

            /**
             * no connection is being created, allow renaming this device.
             */
            if (!World.pendingConnection) {
                let newName = prompt("Rename the device to ?", this.displayName);
                if (hasValue(newName)) {
                    this.displayName = newName;
                }
            } else {
                // connection is pending and attach it to current device.
                if (World.pendingConnection) {
                    (Memory.mem['pendingConnection'] as Cable).add(this);
                    console.log(Memory.mem)
                }
            }
        })

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

    update() {
        this.connection.forEach((_con) => {
            _con.render();
        })
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

    pauseEvent() {
        /**
         * if certain events happen then ignore clicks, drag etc etc.
         */
        if (World.pendingConnection) {
            World.messageBox.setMessage("You are currently in connection mode, select devices to finish the connection");
            return true;
        }

        return false;
    }

    interrupt(intr: EVENTS) {
        this.OS.handlerInterrupt(intr);
    }

    readPacket(p: IPacket) {

        if (p.receiver == this.id) {
            this.OS.recieveDataPacket(p);
        }

    }
}