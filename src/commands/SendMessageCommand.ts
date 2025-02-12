import {apiUrl} from "../utils/ApiUtils.ts";
import BaseCommand from "./BaseCommand.ts";

interface SendMessageResponse {
    "idMessage": string;
}

export class SendMessageCommand extends BaseCommand<string> {

    // constructor(private readonly instanceConfig: InstanceConfig, private readonly chatId: string) {
    //     super(instanceConfig);
    // }

    execute(chatId: string, message: string): Promise<string> {
        const url: string = `${apiUrl}/waInstance${this.instanceConfig.idInstance}/sendMessage/${this.instanceConfig.apiTokenInstance}`;
        const body: any = {
                chatId,
                message
            }
        ;

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then(async (response: Response) => {
            const sendMessageResponse: SendMessageResponse = await response.json();
            return Promise.resolve(sendMessageResponse.idMessage);

        }).catch((e: any) => {
            return Promise.reject(e);
        });
    }
}
