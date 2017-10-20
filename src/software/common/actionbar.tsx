import {Device} from "../../hardware/basic_box";
import * as React from "react";

interface ActionBarProps {
    closeHook: Function;
    device: Device;
}

export class ActionsBar extends React.Component<ActionBarProps, any> {

    onClose = (e) => {
        e.preventDefault();
        this.props.closeHook(e);
    }

    render() {
        return <div className="actions-bar">
            <b className="title">Connected Session - {this.props.device.id}{this.props.device.name ? ` - ${this.props.device.name}`: ''}</b>
            <a className="close" href="#" onClick={this.onClose}>
                <i className="fa fa-window-close" aria-hidden="true"></i>
            </a>
        </div>
    }
}