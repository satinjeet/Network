import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as CodeMirror from "codemirror";


class Console extends React.Component<any, any> {

    state = {
        open: false,
        cmInitialized: false
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
                    <textarea></textarea>
                </div>
        ) : null;
    }

    open() {
        this.setState({open: true});
        if (this.state.open && !this.state.cmInitialized) {
            let t = ReactDOM.findDOMNode(this).querySelector('textarea');
            CodeMirror.fromTextArea(t, {
                lineNumbers: false
            });
        }
    }
}

export class BasicOS {
    private gui;
    private closed;

    constructor() {
        this.gui = ReactDOM.render(<Console/>, document.querySelector('#reactWrapper'));
    }

    display() {
        this.console();
    }

    console() {
        this.gui.open();
    }
}