import * as React from "react";
import {ReactDOM} from "react";
import {IRenderable} from "../interfaces/IRenderable";

class Status extends React.Component<any, any> {
    state = {
        open: false
    }

    render() {
        if (this.state.open) {
            return <StatusWindow />
        }
        return null;
    }
}

class StatusWindow extends React.Component<any, any> {
    render() {
        return <div className="status-window">
            <small>Right click the box to create a new Connection to another Box</small>
        </div>
    }
}
// export ReactDOM.render(<Status/>)