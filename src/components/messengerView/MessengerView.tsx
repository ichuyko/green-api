import {FC, useState} from "react";
import {Button, Layout, Menu, Space, Tooltip} from 'antd';
import {LogoutOutlined} from "@ant-design/icons";
import {InstanceConfig} from "../../common/types/InstanceConfig.ts";
import CreateNewGroup from "../createNewGroup/CreateNewGroup.tsx";
import {CreateGroupResponse} from "../../commands/CreateGroupCommand.ts";
import {MenuItemType} from "antd/es/menu/interface";
import {MenuInfo} from "rc-menu/lib/interface";
import ChatView from "../chatView/ChatView.tsx";
import "./style/messengerView.scss"

const {Sider} = Layout;

interface Props {
    instanceConfig: InstanceConfig;
    onLogout: () => void;
}

const MessengerView: FC<Props> = ({instanceConfig, onLogout}: Props) => {
    const [newGroupVisible, setNewGroupVisible] = useState<boolean>(false);

    const items: MenuItemType[] = ["Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", "Chat1", "Chat2", "Chat3", ].map(
        (name: string, index: number) => ({
            key: `${name}_${index}`,
            label: name,
        }),
    );

    const myChats: MenuItemType[] = [
        {
            key: "120363400246337090@g.us",
            label: "120363400246337090"
        },
        {
            key: "120363400164924999@g.us",
            label: "120363400164924999"
        },
    ];

    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]); // myChats || items
    const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);


    const createNewChat = () => {
        setNewGroupVisible(true);
    };

    const handleOnCreateNewGroup = (newGroup: CreateGroupResponse, groupName: string) => {
        setNewGroupVisible(false);
        const newItem: MenuItemType = {
            key: newGroup.chatId,
            label: groupName
        };
        setMenuItems([...menuItems, newItem]);
        setSelectedMenuKeys([newItem.key.toString()]);
    };

    const handleMenuChange = ({key}: MenuInfo) => {
        setSelectedMenuKeys([key]);
    };

    return (
        <>
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    width={250}
                    theme={"light"}
                >
                    <div className={"slider-content"}>
                        <div className="logo-wrapper">
                            <img src={"https://upload.wikimedia.org/wikipedia/commons/f/f7/WhatsApp_logo.svg"}
                                 alt={"logo"}/>
                        </div>
                        <div className={"menu-container"}>
                            <Menu mode="inline" selectedKeys={selectedMenuKeys} items={menuItems} onClick={handleMenuChange}/>
                        </div>
                        <div className={"menu-footer"}>
                            <Space>
                                <Button type={"primary"} onClick={createNewChat}>New Group</Button>
                                <Tooltip title="Logout">
                                    <Button shape="circle" onClick={onLogout} icon={<LogoutOutlined/>}/>
                                </Tooltip>

                            </Space>
                        </div>
                    </div>
                </Sider>
                <Layout>
                    {!selectedMenuKeys.length && <p>Select chat</p>}
                    {selectedMenuKeys.length && <ChatView instanceConfig={instanceConfig} chatId={selectedMenuKeys[0]}/>}
                </Layout>
            </Layout>
            {newGroupVisible && <CreateNewGroup instanceConfig={instanceConfig} onOk={handleOnCreateNewGroup} onCancel={() => setNewGroupVisible(false)}/>}
        </>
    );
};

export default MessengerView;
