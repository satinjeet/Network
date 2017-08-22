import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as CodeMirror from "codemirror";


class Console extends React.Component<any, any> {

    state = {
        open: false,
        cmInitialized: false
    }

    props = {
        commandHook: undefined
    }

    keyPress = (e: any) => {
        if (e.key == 'Enter') {
            this.props.commandHook(e.currentTarget.value);
            e.currentTarget.value = null;
        }
    }

    onClose = (e) => {
        e.preventDefault();
        this.setState({ open: false });
    }

    render() {
        return this.state.open ? (
                <div className="console">
                    <a className="close" href="#" onClick={this.onClose}>
                        <i className="fa fa-window-close" aria-hidden="true"></i>
                    </a>
                    <div contentEditable={true}></div>
                    <input type="text" onKeyPress={this.keyPress}/>
                </div>
        ) : null;
    }

    open() {
        this.setState({open: true});
        if (this.state.open && !this.state.cmInitialized) {
            let t = ReactDOM.findDOMNode(this).querySelector('textarea');
            // CodeMirror.fromTextArea(t, {
            //     lineNumbers: false
            // });
        }
    }
}

export class BasicOS {
    private gui;
    private closed;

    constructor() {
        this.gui = ReactDOM.render(<Console commandHook={this.commandReceived}/>, document.querySelector('#reactWrapper'));
    }

    commandReceived = (command: string) => {
        console.log('Recieved Command : ', command);
    }

    display() {
        this.console();
    }

    console() {
        this.gui.open();
    }
}