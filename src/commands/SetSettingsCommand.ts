import {apiUrl} from "../utils/ApiUtils.ts";
import BaseCommand from "./BaseCommand.ts";

export class SetSettingsCommand extends BaseCommand<string> {
    execute(): Promise<string> {
        const url: string = `${apiUrl}/waInstance${this.instanceConfig.idInstance}/setSettings/${this.instanceConfig.apiTokenInstance}`;
        const body: any = {
            "webhookUrl": "",
            "outgoingWebhook": "yes",
            "incomingWebhook": "yes"
        };

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then(async (response: Response) => {
            const responseJSON: any = await response.json();
            return Promise.resolve(responseJSON)
        }).catch((e: any) => {
            return Promise.reject(e);
        });
    }
}
