import {IRenderable} from "../interfaces/IRenderable";
import {IDevice} from "../interfaces/IDevice";
import {World} from "../../index";

export class Infobox implements IRenderable {

    public inst: Snap.Element;
    // private text: Snap.Element;
    // private box: Snap.Element;

    constructor(private device: IDevice, private x: number, private y: number) {
        this.x += 20;
        this.y += 20;
    }

    move(x, y) {
        this.inst.attr({
            'transform': `t${x - this.x},${y - this.y + 20}s`
        })
    }

    render() {
        let box = World.stage().rect(this.x, this.y, 200, 100);
        let text: Snap.Element[] = [
            World.stage().text(this.x + 5, this.y + 20, this.device.displayName),
            World.stage().text(this.x + 5, this.y + 40, `Machine-type: ${this.device.type}`),
            World.stage().text(this.x + 5, this.y + 60, `Running OS: ${this.device.OS.type}`),
            World.stage().text(this.x + 5, this.y + 80, `H/W Address: ${this.device.id}`),
        ];


        box.attr({ fill: "white", opacity: "0.4", stroke: "black", strokeWidth: "2" });
        text.forEach(_t => {_t.attr({fontFamily: 'monospace'})});

        this.inst = World.stage().group(box, ...text);
    }

    destroy() {
        this.inst.remove();
    }


}