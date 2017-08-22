import {BasicOS} from "../software/os";

export class BasicBox {
    OS: BasicOS = new BasicOS;

    private inst;

    constructor(private stage: Snap.Paper, private x: number, private y: number) {
        this.render();
    }

    render() {
        this.inst =  this.stage.rect(this.x, this.y, 100, 50);
        this.inst.click((e) => {
            e.stopPropagation();
            this.OS.display();
        })
    }
}