import * as React from "react";

interface Props {
    eventAddDevice: Function,
    eventAddConnection: Function
}

export class Menu extends React.Component<Props, any> {

    addConnection = (e) => {
        this.props.eventAddConnection(e);
    }

    addDevice = (e) => {
        this.props.eventAddDevice(e);
    }

    render() {
        return <div className="menu">
            <a className="menu-item" href="#" onClick={this.addDevice}>
                <span className="fa-stack fa-lg">
                  <i className="fa fa-circle fa-stack-2x"></i>
                  <i className="fa fa-cube fa-stack-1x fa-inverse"></i>
                </span>
                Add Device
            </a>
            <a className="menu-item" href="#" onClick={this.addConnection}>
                <span className="fa-stack fa-lg">
                  <i className="fa fa-circle fa-stack-2x"></i>
                  <i className="fa fa-ellipsis-h fa-stack-1x fa-inverse"></i>
                </span>
                Add Connection - Cable
            </a>
        </div>
    }
}