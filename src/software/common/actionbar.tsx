import {Device} from "../../hardware/basic_box";
import * as React from "react";

interface ActionBarProps {
    closeHook: Function;
}

export class ActionsBar extends React.Component<ActionBarProps, any> {

    onClose = (e) => {
        e.preventDefault();
        this.props.closeHook(e);
    }

    render() {
        return <div className="actions-bar">
            <a className="close" href="#" onClick={this.onClose}>
                <i className="fa fa-window-close" aria-hidden="true"></i>
            </a>
        </div>
    }
}