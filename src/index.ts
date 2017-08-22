import {registerEvents} from "./events";
import * as Snap from 'snapsvg';

let l = Snap(window.innerWidth, window.innerHeight);

registerEvents(l);