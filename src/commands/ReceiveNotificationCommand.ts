import {apiUrl} from "../utils/ApiUtils.ts";
import BaseCommand from "./BaseCommand.ts";

export interface ReceiveNotificationResponse {
    "receiptId": string;
    "body": {
        typeWebhook: string;
        timestamp: string;
        idMessage: string;
        senderData: {
            chatId: string;
            sender: string;
            senderName: string;
        },
        messageData?: {
            typeMessage: string;
            textMessageData: {
                textMessage: string;
            };
        };
    };
}

export class ReceiveNotificationCommand extends BaseCommand<ReceiveNotificationResponse | null> {

    execute(): Promise<ReceiveNotificationResponse | null> {
        const url: string = `${apiUrl}/waInstance${this.instanceConfig.idInstance}/receiveNotification/${this.instanceConfig.apiTokenInstance}`;

        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response: Response) => {
            const result: ReceiveNotificationResponse | null = await response.json();
            return Promise.resolve(result);

        }).catch((e: any) => {
            return Promise.reject(e);
        });
    }
}
