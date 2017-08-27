import * as Snap from "snapsvg";
import {BasicBox} from "./hardware/basic_box";
import * as ReactDOM from "react-dom";
import {Menu} from "./appui/menu";
import * as React from "react";
import {Messagebox} from "./appui/messagebox";
import {World} from "./index";
import {OSWrapper} from "./appui/os_wrapper";
import {Cable} from "./hardware/network/cable";


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
                    new Cable()
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

    World.osLayer = ReactDOM.render(
        React.createElement(
            OSWrapper
        ),
        document.querySelector('#reactWrapper')
    )
}