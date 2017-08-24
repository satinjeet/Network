import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as CodeMirror from "codemirror";
import {Device} from "../hardware/basic_box";
import {Kernal} from "./kernal/command";

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

class Console extends React.Component<Props, State> implements OSGUI {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            cmInitialized: false,
            output: [],
        };
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
                            sess-{ this.props.device.name ? this.props.device.name: this.props.device.id }$ <input type="text" className="input-console" onKeyPress={this.keyPress}/>
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

export interface OS {
    gui: OSGUI;

}

export class BasicOS extends Kernal implements  OS {
    gui: any;

    constructor(private machine: Device) {
        super();
        this.gui = ReactDOM.render(<Console commandHook={this.commandReceived} device={this.machine}/>, document.querySelector('#reactWrapper'));
    }

    commandReceived = (command: string) => {
        console.log('Recieved Command : ', command);
        return this.execute(command);
    }

    display() {
        this.console();
    }

    console() {
        this.gui.open();
    }
}