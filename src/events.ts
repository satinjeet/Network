import * as Snap from "snapsvg";
import {BasicBox} from "./hardware/basic_box";
import * as ReactDOM from "react-dom";
import {Menu} from "./appui/menu";
import * as React from "react";
import {Messagebox} from "./appui/messagebox";
import {World} from "./index";


export function registerEvents(canvas: Snap.Paper) {
    // canvas.click((e: MouseEvent) => {
    //     new BasicBox(canvas, e.clientX, e.clientY);
    // })

    /**
     * init menu
     */
    ReactDOM.render(
        React.createElement(
            Menu,
            {
                eventAddDevice: (e) => {
                    new BasicBox(canvas, window.innerWidth / 2, window.innerHeight/2);
                },
                eventAddConnection: (e) => {
                    console.log('impl pending');
                }
            }
        ),
        document.querySelector('#menuWrappper')
    )

    World.messageBox = ReactDOM.render(
        React.createElement(
            Messagebox
        ),
        document.querySelector('#genericRoot')
    )
}