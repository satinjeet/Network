import {TimedTasks} from "../base/clock";

export enum Commands {
    COMMAND_HELP
}

export interface DangerousHTML {
    __html: string;
}

interface Command {
    execute(): DangerousHTML;

    displayHelp();
}

class HelpCommand implements Command {
    execute(): DangerousHTML {
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

export abstract class Kernal {

    execute(command: string) {
        let executer = CommandStructure.supports(command) ? CommandStructure.map[command] : {};

        return (new executer).execute();
    }

}