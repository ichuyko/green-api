import {apiUrl} from "../utils/ApiUtils.ts";
import BaseCommand from "./BaseCommand.ts";

export interface CreateGroupResponse {
    "created": boolean;
    "chatId": string;
    "groupInviteLink": string;
}

export class CreateGroupCommand extends BaseCommand<CreateGroupResponse> {
    execute(phoneNumber: string): Promise<CreateGroupResponse> {
        const url: string = `${apiUrl}/waInstance${this.instanceConfig.idInstance}/createGroup/${this.instanceConfig.apiTokenInstance}`;
        const body: any = {
            "groupName": phoneNumber,
            "chatIds": [
                `${phoneNumber}@c.us`,
            ]
        };

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then(async (response: Response) => {
            const createGroupResponse: CreateGroupResponse = await response.json();
            if (createGroupResponse.created) {
                return Promise.resolve(createGroupResponse)
            } else {
                return Promise.reject(createGroupResponse);
            }

        }).catch((e: any) => {
            return Promise.reject(e);
        });
    }
}
