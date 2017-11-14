import {Network, NetWorkQueueJob} from "../../base/os";
import {Command, DangerousHTML} from "../command";
import {EVENTS} from "../../hwInterrupts/events";
import {IPacket, Packet, PacketTypePing} from "../../base/packet";
import {MessageDirection} from "../../base/types";
import {uuid} from "../../../common/utils";
import {SubjectSubscriber} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

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
                let k = [1,2,3,4];
                let op: string = uuid();
                let jq: NetWorkQueueJob = new NetWorkQueueJob();
                let resp: string[] = [];
                let subscription: Subscription;
                let timers: number[] = [];

                driver.driver.jobQueue[op] = jq;

                subscription = driver.driver.medium.subscribe((p: IPacket) => {
                    if (p.direction == MessageDirection.TO) {
                        driver.driver.jobQueue[p.data].Remove();

                        if (driver.driver.jobQueue[p.data].Completed) {
                            let diff: number = (new Date().getTime()) - timers.shift();
                            resp.push(`Device connected, ping time ${diff/100} sec.`);
                        }
                    }
                })

                Object.assign([],k).map((i, index) => {
                    jq.Job = i;
                    let p = new Packet();
                    p.type = new PacketTypePing();
                    p.data = op;
                    p.direction = MessageDirection.FROM;

                    p = driver.driver.signPacket(p);
                    timers.push(new Date().getTime());
                    driver.driver.sendDataPacket(p);
                });

                subscription.unsubscribe();
                res({
                    __html: resp.join("<br>")
                });
            })
        }
    }

    displayHelp() {
        return `Usage <i>ping &lr;device_id&gr; </i> to display available commands.`
    }
}