import * as React from "react";

const DEFAULT_MESSAGE: string = '-- IDLE --';

interface State {
    message: string
}

export class Messagebox extends React.Component<any, State> {

    state = {
        message: DEFAULT_MESSAGE
    }

    timer: any;

    setMessage(msg: string, wait: boolean = false) {

        /**
         * begin display new message.
         * if it is empty, replace it with default message.
         */
        if (!msg) {
            msg = DEFAULT_MESSAGE;
        }

        this.setState({
            message: msg
        });
        /**
         * end display new message
         */

        /**
         * after 5 seconds clear out the message box
         */
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.setState({
                message: DEFAULT_MESSAGE
            })
        }, wait ? 15000: 5000);

    }

    render() {
        return <div className="message-box">
            {this.state.message}
        </div>
    }
}