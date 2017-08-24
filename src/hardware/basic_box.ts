import {BasicOS} from "../software/os";
import {generateHDWId, getRandomName} from "./utility/utils";
import {Memory, World} from "../index";
import {Cable, NetworkMedium} from "./network/cable";

export interface Device {
    OS: BasicOS;

    id: string;
    name: string;

    x: number;

    y: number;
}

export class BasicBox {
    public OS: BasicOS;
    public id: string = generateHDWId();
    public name: string = getRandomName();
    public connection: NetworkMedium[] = [];

    private inst: Snap.Element;

    constructor(private stage: Snap.Paper, public x: number, public y: number) {
        this.render();
        this.OS = new BasicOS(this);

        Memory.add(this.id, this);
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
            e.stopPropagation();
            e.preventDefault();
            this.OS.display();
        })

        // this.inst.click((e) => {
        //     e.preventDefault();
        //     e.stopPropagation();
        //
        //     if (Memory.mem['pendingConnection']) {
        //         cable = Memory.mem['pendingConnection']
        //         cable.add(this);
        //         delete Memory.mem['pendingConnection'];
        //         Memory.add(`Connection-${cable.devices[0].id}-${cable.devices[1].id}`, cable);
        //     } else {
        //         cable = new Cable();
        //         cable.add(this);
        //         Memory.add('pendingConnection', cable);
        //     }
        //     this.connection.push(cable);
        //     console.log(Memory.mem)
        // })

        this.inst.mouseover((e: MouseEvent) => {
            showStatus = true;
            if (statusBox) return;

            statusBox = new Status(this, e.clientX, e.clientY);
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

        this.inst.drag(this.move, this.start, undefined);
    }

    move = (dx, dy) => {
        this.inst.attr({
            transform: this.inst.data('origTransform') + (this.inst.data('origTransform') ? "T" : "t") + [dx, dy]
        });
    }

    start = () => {
        this.inst.data('origTransform', this.inst.transform().local);
    }
}

class Status {

    private inst: Snap.Element;
    private text: Snap.Element;
    private box: Snap.Element;

    constructor(private device: Device, private x: number, private y: number) {
        this.x += 20;
        this.y += 20;
    }

    move(x, y) {
        this.inst.attr({
            'transform': `t${x - this.x},${y - this.y + 20}s`
        })
    }

    render() {
        this.box = World.stage().rect(this.x, this.y, 200, 100);
        this.box.attr({ fill: "white", opacity: "0.4", stroke: "black", strokeWidth: "2" });
        this.text = World.stage().text(this.x + 5, this.y + 20, this.device.name);
        this.text.attr({fontFamily: 'monospace'});
        this.inst = World.stage().group(this.box, this.text);

    }

    destroy() {
        this.inst.remove();
    }


}