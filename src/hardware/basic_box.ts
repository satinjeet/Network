import {BasicOS} from "../software/os";
import {generateHDWId} from "./utility/utils";
import {Memory} from "../index";
import {Cable, NetworkMedium} from "./network/cable";

export interface Device {
    OS: BasicOS;

    id: string;
    name: string;

    x: number;

    y: number;
}

export class BasicBox {
    public OS: BasicOS = new BasicOS(this);
    public id: string = generateHDWId();
    public name: string = "";
    public connection: NetworkMedium[] = [];

    private inst: Snap.Element;


    constructor(private stage: Snap.Paper, public x: number, public y: number) {
        this.render();

        Memory.add(this.id, this);
    }

    render() {
        let showStatus = false;
        let statusBox = undefined;
        let cable: Cable;

        this.inst = this.stage.rect(this.x, this.y, 100, 50);

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

            statusBox = new Status(this.stage, e.clientX, e.clientY);
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

    constructor(private stage: Snap.Paper, private x: number, private y: number) {
        this.x += 20;
        this.y += 20;
    }

    move(x, y) {
        this.inst.attr({
            'transform': `t${x - this.x},${y - this.y + 20}s`
        })
    }

    render() {
        this.box = this.stage.rect(this.x, this.y, 200, 100);
        this.box.attr({ fill: "white", opacity: "0.4", stroke: "black", strokeWidth: "2" });
        this.text = this.stage.text(this.x, this.y + 20, "Nothing for now");
        this.inst = this.stage.group(this.box, this.text);

    }

    destroy() {
        this.inst.remove();
    }


}