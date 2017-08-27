import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as CodeMirror from "codemirror";
import {Device} from "../hardware/basic_box";
import {DangerousHTML, Kernal} from "./kernal/command";
import {World} from "../index";

export interface OSGUI {

}

interface State {
    open: boolean;
    cmInitialized: boolean;
    output: {__html: string}[];
}

interface Props {
    commandHook: Function;
    device: Device;
}

interface ActionBarProps {
    closeHook: Function;
}

class ActionsBar extends React.Component<ActionBarProps, any> {

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

export class Console extends React.Component<Props, State> implements OSGUI {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            cmInitialized: false,
            output: [],
        };
        this.props.device.OS.gui = this;
    }

    keyPress = (e: any) => {
        if (e.key == 'Enter') {
            let newState = this.state.output;
            newState.push(this.props.commandHook(e.currentTarget.value));

            this.setState({
                output: newState
            })

            console.log(this.state)
            e.currentTarget.value = null;
        }
    }

    onClose = (e) => {
        e.preventDefault();
        this.setState({ open: false });
    }

    render() {
        return this.state.open ? (
                <div>
                    <ActionsBar closeHook={this.onClose}/>
                    <div className="console">
                        <b>Connected Session - {this.props.device.id}{this.props.device.name ? ` - ${this.props.device.name}`: ''}</b>
                        <br></br>
                        <div>
                            {
                                this.state.output.map((_o, i) => {
                                    return <div key={i} dangerouslySetInnerHTML={_o}></div>
                                })
                            }
                        </div>
                        <span>
                            { this.props.device.name ? this.props.device.name: this.props.device.id }$ <input type="text" className="input-console" onKeyPress={this.keyPress}/>
                        </span>
                    </div>
                </div>
        ) : null;
    }

    open() {
        this.setState({open: true});
        if (this.state.open && !this.state.cmInitialized) {
            let t: HTMLInputElement = ReactDOM.findDOMNode(this).querySelector('input.input-console') as HTMLInputElement;
            t.focus();

            // CodeMirror.fromTextArea(t, {
            //     lineNumbers: false
            // });
        }
    }
}

export enum OS_MODES {
    MODE_GUI,
    MODE_CONSOLE
}

export interface OS {
    gui: OSGUI;
    mode: OS_MODES;
    machine: Device;
    nmapTimer: any;

    commandReceived(command: string): DangerousHTML;

    display();

    console();

    network();
}

export class BasicOS extends Kernal implements OS {
    gui: any;
    mode = OS_MODES.MODE_CONSOLE;
    nmapTimer: any;
    ttyl:number =  5*1000;

    constructor(public machine: Device) {
        super();
        // this.gui = ReactDOM.render(
        //     <Console commandHook={this.commandReceived} device={this.machine}/>,
        //     document.querySelector('#reactWrapper')
        // );
        World.osLayer.addOs(this);
    }

    commandReceived = (command: string): DangerousHTML => {
        console.log('Received Command : ', command);
        return this.execute(command);
    }

    display() {
        this.console();
    }

    console() {
        this.gui.open();
    }

    networkDriver = () => {

    }

    network() {

        this.nmapTimer = setInterval(this.networkDriver, this.ttyl);
    }
}