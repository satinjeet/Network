import {TimedTasks} from "../base/clock";
import {OS} from "../base/os";
import {PingCommand} from "./commands/ping";

export enum Commands {
    COMMAND_HELP
}

export interface DangerousHTML {
    __html: string;
}

export interface Command {
    execute(os: any): Promise<DangerousHTML>;

    displayHelp();
}

class HelpCommand implements Command {
    execute(os: OS): Promise<DangerousHTML> {
        return new Promise((res, rej) => {
            res({
                __html: `Current set of defined commands :
                    <br> - ${CommandStructure.binaries.join('<br> - ')} 
                `
            })
        });
    }

    displayHelp() {
        return `Use <i>help</i> to display available commands.`
    }
}

export class CommandStructure {

    static binaries: string[] = [
        'help', 'nmap', 'ping'
    ];

    static map: Object = {
        'help': HelpCommand,
        'nmap': HelpCommand,
        'ping': PingCommand
    }

    /**
     * regex match
     * @param {string} command
     * @returns {boolean}
     */
    static supports(command: string) {
        let [commandName] = command.split(' ');
        return CommandStructure.binaries.indexOf(commandName) > -1 ? CommandStructure.map[commandName]: HelpCommand;
    }
}

export abstract class Kernal extends TimedTasks {

    execute(command: string): Promise<DangerousHTML> {
        let executer = CommandStructure.supports(command);

        return (new executer(command)).execute(this);
    }

}