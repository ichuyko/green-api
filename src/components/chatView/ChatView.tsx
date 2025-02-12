import {ChangeEvent, FC, useEffect, useState} from "react";
import {Input, Layout, Spin} from "antd";
import {InstanceConfig} from "../../common/types/InstanceConfig.ts";
import {SendMessageCommand} from "../../commands/SendMessageCommand.ts";
import {GetChatHistoryCommand, GetChatHistoryResponseItem} from "../../commands/GetChatHistoryCommand.ts";
import {ReceiveNotificationCommand, ReceiveNotificationResponse} from "../../commands/ReceiveNotificationCommand.ts";
import {DeleteNotificationCommand} from "../../commands/DeleteNotificationCommand.ts";

const {Header, Content, Footer} = Layout;

interface Props {
    instanceConfig: InstanceConfig;
    chatId: string;
}

const ChatView: FC<Props> = (props: Props) => {
    const [messageText, setMessageText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    let timerId: number | undefined;

    const [messages, setMessages] = useState<GetChatHistoryResponseItem[] | undefined>(undefined);

    useEffect(() => {
        if (timerId) {
            clearTimeout(timerId);
            timerId = undefined;
        }
        setMessageText("");
        setMessages(undefined)
        loadMessages(props.chatId);

        return () => {
            if (timerId) {
                clearTimeout(timerId);
                timerId = undefined;
            }
        };
    }, [props.chatId]);

    const loadMessages = async (chatId: string) => {
        setLoading(true);
        try {
            const msgs: GetChatHistoryResponseItem[] = await new GetChatHistoryCommand(props.instanceConfig).execute(chatId);
            setMessages(msgs);
            getNotification(chatId);
            setLoading(false);
        } catch (e: any) {
            console.error(e);
        }
    };

    const getNotification = async (chatId: string) => {
        try {
            const notification: ReceiveNotificationResponse | null = await new ReceiveNotificationCommand(props.instanceConfig).execute();
            if (notification) {
                const isIncomingMessageReceived: boolean = notification.body.typeWebhook === "incomingMessageReceived";
                const isOutgoingMessageStatus: boolean = notification.body.typeWebhook === "outgoingMessageStatus";
                const isTextMessage: boolean = notification.body.messageData?.typeMessage === "textMessage" || notification.body.messageData?.typeMessage === "extendedTextMessage";
                if ((isIncomingMessageReceived || isOutgoingMessageStatus)
                    && notification.body.senderData.chatId === chatId
                    && isTextMessage) {
                    const newMsg: GetChatHistoryResponseItem = {
                        type: isIncomingMessageReceived ? "incoming" : "outgoing",
                        idMessage: notification.body.idMessage,
                        timestamp: notification.body.timestamp,
                        chatId,
                        typeMessage: notification.body.messageData!.typeMessage,
                        textMessage: notification.body.messageData!.textMessageData.textMessage,
                        senderId: notification.body.senderData.sender,
                        senderName: notification.body.senderData.senderName,
                    };
                    setMessages([...messages || [], newMsg])
                }
                new DeleteNotificationCommand(props.instanceConfig).execute(notification.receiptId).then(() => {
                    getNotification(chatId);
                });
            } else {
                checkNotificationLater(chatId);
            }
        } catch (e: any) {
            console.error(e);
            checkNotificationLater(chatId);
        }
    };

    const checkNotificationLater = (chatId: string) => {
        if (chatId !== props.chatId) {
            return;
        }
        timerId = setTimeout(() => {
            timerId = undefined;
            getNotification(chatId);
        }, 5000);
    };

    const messageTextOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
    };

    const sendNewMessage = async () => {
        try {
            setLoading(true);
            await new SendMessageCommand(props.instanceConfig).execute(props.chatId, messageText);
            // loadMessages(); // get it via notifications
            setMessageText("");
        } catch (e: any) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header className={"chat-header"}>{props.chatId}</Header>
            <Content className={"chat-content"}>
                <div className={"chat-content__list"}>
                    <Spin tip="Loading..." size={"large"} spinning={messages === undefined}>
                        {(messages || []).map((msg: GetChatHistoryResponseItem) => {
                            return (
                                <div key={msg.idMessage} className={`message-item message-item__${msg.type}`}>
                                    {msg.senderName ?? "Me"}: {msg.textMessage || msg.extendedTextMessage?.text}
                                </div>
                            );
                        })}
                    </Spin>
                </div>
            </Content>
            <Footer className={"footer-content"}>
                <Input placeholder={"Send message"} value={messageText} disabled={loading}
                       onChange={messageTextOnChange}
                       onPressEnter={sendNewMessage}/>
            </Footer>
        </>
    );
};

export default ChatView;
