import * as React from "react";
import {Device} from "../../hardware/basic_box";
import {ActionsBar} from "./actionbar";
import {OSGUI} from "../base/os";
import * as ReactDOM from "react-dom";

interface State {
    open: boolean;
    cmInitialized: boolean;
    output: {__html: string}[];
}

interface Props {
    commandHook: Function;
    device: Device;
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