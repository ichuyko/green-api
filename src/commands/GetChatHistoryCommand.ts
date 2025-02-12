import {apiUrl} from "../utils/ApiUtils.ts";
import BaseCommand from "./BaseCommand.ts";

export interface GetChatHistoryResponseItem {
    "type": string;
    "idMessage": string;
    "timestamp": string;
    "typeMessage": string;
    "chatId": string;
    "textMessage": string;
    extendedTextMessage?: {
        text: string;
    },
    "senderId": string;
    "senderName": string;
}

export class GetChatHistoryCommand extends BaseCommand<GetChatHistoryResponseItem[]> {

    execute(chatId: string): Promise<GetChatHistoryResponseItem[]> {
        const url: string = `${apiUrl}/waInstance${this.instanceConfig.idInstance}/getChatHistory/${this.instanceConfig.apiTokenInstance}`;
        const body: any = {
                chatId,
            }
        ;

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then(async (response: Response) => {
            const result: GetChatHistoryResponseItem[] = await response.json();
            return Promise.resolve(result
                .filter((i: GetChatHistoryResponseItem) => i.typeMessage === "textMessage" || i.typeMessage === "extendedTextMessage")
                .reverse());

        }).catch((e: any) => {
            return Promise.reject(e);
        });
    }
}
