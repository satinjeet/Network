import {Network, Packet} from "../../base/os";
import {Command, DangerousHTML} from "../command";

export class PingCommand implements Command {

    private addr: string;
    private localAlias: string[] = [
        "me",
        "local",
        "localhost",
        "self"
    ];

    constructor(rawCommand: string) {
        let [cmdName, addr] = rawCommand.split(' ');
        this.addr = addr;
    }

    execute(os: Network): Promise<DangerousHTML> {
        /**
         * find the appropriate driver;
         */

        if (this.localAlias.indexOf(this.addr) > -1) {
            return new Promise((res, rej) => {
                res({
                    __html: `Device connected, ping time 0.00 sec.`
                })
            })
        }

        let driver = os.networkMap.find((_nmap) => {
            return _nmap.addr == this.addr;
        });

        if (!driver) {
            return new Promise((res, rej) => {
                res({
                    __html: "No device found !!"
                })
            });
        } else {
            return new Promise((res, rej) =>{
                driver.driver.sendDataPacket(
                    driver.driver.signPacket({
                        data: 'ping'
                    } as Packet)
                ).then((response) => {
                    let {connected, pingTime} = response;
                    res({
                        __html: `Device connected, ping time ${pingTime / 1000} sec.`
                    })
                }).catch(() => {
                    rej({
                        status: 1,
                        message: `Device ${this.addr} not connected.`
                    })
                })
            })
        }
    }

    displayHelp() {
        return `Usage <i>ping &lr;device_id&gr; </i> to display available commands.`
    }
}