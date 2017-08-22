import * as Snap from "snapsvg";
import {BasicBox} from "./hardware/basic_box";

export function registerEvents(canvas: Snap.Paper) {
    canvas.click((e: MouseEvent) => {
        new BasicBox(canvas, e.clientX, e.clientY);
    })
}