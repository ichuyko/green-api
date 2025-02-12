import {apiUrl} from "../utils/ApiUtils.ts";
import BaseCommand from "./BaseCommand.ts";

export class GetSettingsCommand extends BaseCommand {
    execute(): Promise<string> {
        const url: string = `${apiUrl}/waInstance${this.instanceConfig.idInstance}/getSettings/${this.instanceConfig.apiTokenInstance}`;
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response: Response) => {
            const responseJSON: any = await response.json();
            return Promise.resolve(responseJSON)
        }).catch((e: any) => {
            return Promise.reject(e);
        });
    }

}
