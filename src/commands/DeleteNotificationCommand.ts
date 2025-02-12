import {apiUrl} from "../utils/ApiUtils.ts";
import BaseCommand from "./BaseCommand.ts";

interface DeleteNotificationResponse {
    "result": boolean;
}

export class DeleteNotificationCommand extends BaseCommand<boolean> {

    execute(receiptId: string): Promise<boolean> {
        const url: string = `${apiUrl}/waInstance${this.instanceConfig.idInstance}/deleteNotification/${this.instanceConfig.apiTokenInstance}/${receiptId}`;

        return fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response: Response) => {
            const deleteNotificationResponse: DeleteNotificationResponse = await response.json();
            return Promise.resolve(deleteNotificationResponse.result);

        }).catch((e: any) => {
            return Promise.reject(false);
        });
    }
}
