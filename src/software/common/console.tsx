import * as React from "react";
import {IDevice} from "../../hardware/interfaces/IDevice";
import {ActionsBar} from "./actionbar";
import {OSGUI} from "../base/os";
import * as ReactDOM from "react-dom";

interface State {
    open: boolean;
    cmInitialized: boolean;
    output: {__html: string}[];
}

interface Props {
    /**
     * change to Promise
     */
    commandHook: Function;
    device: IDevice;
}

export class Console extends React.Component<Props, State> implements OSGUI {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            cmInitialized: false,
            output: [],
        };
        this.props.device.OS.gui = this;
    }

    get promptString(): string {
        return `${this.props.device.name ? this.props.device.name: this.props.device.id }$ `;
    }

    keyPress = (e: any) => {
        e.persist();
        let tBox = e.currentTarget;
        let cmd = tBox.value;

        if (e.key == 'Enter') {
            let newState = this.state.output;
            this.props.commandHook(cmd).then((cmdOutput) => {
                newState.push({
                    __html: `${this.promptString}${cmd}`
                })
                newState.push(cmdOutput);
                this.setState({
                    output: newState
                })

                console.log(this.state)
                tBox.value = null;
            }).catch(() => {
                newState.push({
                    __html: `${this.promptString}${cmd}`
                })
                newState.push({
                    __html: `Execution failed : ${cmd}`
                })
                this.setState({
                    output: newState
                })
            })
        }
    }

    onClose = (e) => {
        e.preventDefault();
        this.setState({ open: false });
    }

    render() {
        return this.state.open ? (
            <div>
                <ActionsBar closeHook={this.onClose} device={this.props.device}/>
                <div className="console">
                    <br></br>
                    <div>
                        {
                            this.state.output.map((_o, i) => {
                                return <div key={i} dangerouslySetInnerHTML={_o}></div>
                            })
                        }
                    </div>
                    <span>
                        { this.promptString }<input type="text" className="input-console" onKeyPress={this.keyPress}/>
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