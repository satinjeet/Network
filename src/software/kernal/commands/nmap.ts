import {Command, DangerousHTML} from "../command";

export class NMap implements Command {
    execute(os: any): Promise<DangerousHTML> {

        return new Promise((res, rej) => {

            let d: any[] = os.networkMap.map((_map: any) => {
                return `<tr>
                    <td>${_map.addr}</td>
                    <td>${_map.name}</td>
                    <td>${_map.driver.type}</td>
                </tr>`;
            });

            return res({
                __html: `<table><tr><td>Address</td><td>Name</td><td>Connection Type</td></tr>${d.join('')}</table>`
            });
        });
    }

    displayHelp() {
        return `Usage <i>npm</i> to display list of connected devices.`
    }

}