import {TimedTasks} from "../base/clock";
import {NetworkDriver, OS} from "../base/os";

export enum Commands {
    COMMAND_HELP
}

export interface DangerousHTML {
    __html: string;
}

interface Command {
    execute(os: any): DangerousHTML;

    displayHelp();
}

class HelpCommand implements Command {
    execute(os: OS): DangerousHTML {
        return {
            __html: `Current set of defined commands :
            <br> - ${CommandStructure.binaries.join('<br> - ')} 
        `
        }
    }

    displayHelp() {
        return `Use <i>help</i> to display available commands.`
    }
}

class PingCommand implements Command {
    execute(os: NetworkDriver) {
        return {
            __html: ""
        }
    }

    displayHelp() {
        return `Usage <i>ping &lr;device_id&gr; </i> to display available commands.`
    }
}

export class CommandStructure {

    static binaries: string[] = [
        'help', 'nmap', 'ping'
    ];

    static map: Object = {
        'help': HelpCommand,
        'nmap': HelpCommand,
        'ping': HelpCommand
    }

    static supports(command: string) {
        return CommandStructure.binaries.indexOf(command) > -1;
    }
}

export abstract class Kernal extends TimedTasks {

    execute(command: string) {
        let executer = CommandStructure.supports(command) ? CommandStructure.map[command] : {};

        return (new executer).execute(this);
    }

}