
import {Console, OS, OS_MODES, OSGUI} from "../software/os";
import * as React from "react";

interface State {
    osList: OS[];
}

export class OSWrapper extends React.Component<any, State> {

    state: State = {
        osList: []
    }
    constructor(props) {
        super(props);
    }

    addOs(os: OS) {
        let osList = this.state.osList;
        osList.push(os);

        this.setState({
            osList
        })
    }

    render() {
        return <div>
            {
                this.state.osList.map((_os: OS, i: number) => {
                    if (_os.mode == OS_MODES.MODE_CONSOLE) {
                        return <Console commandHook={_os.commandReceived} device={_os.machine} key={i}></Console>
                    }
                })
            }
        </div>
    }

}