import {ChangeEvent, FC, useState} from "react";
import {Button, Input, Modal, Space, Typography} from 'antd';
import {InstanceConfig} from "../../common/types/InstanceConfig.ts";
import {CreateGroupCommand, CreateGroupResponse} from "../../commands/CreateGroupCommand.ts";

const {Text} = Typography;

interface Props {
    instanceConfig: InstanceConfig;
    onOk: (newGroup: CreateGroupResponse, groupName: string) => void;
    onCancel: () => void;
}

const CreateNewGroup: FC<Props> = ({instanceConfig, onOk, onCancel}: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string | undefined>();
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    const handleOnClick = async () => {
        setLoading(true);
        setErrorText(undefined);
        try {
            const newGroup: CreateGroupResponse = await new CreateGroupCommand(instanceConfig).execute(phoneNumber);
            if (newGroup.created) {
                onOk(newGroup, phoneNumber);
            } else {
                throw new Error(JSON.stringify(newGroup));
            }
        } catch (e: any) {
            console.error(e);
            setLoading(false);
            setErrorText(`Can't create new group: ${e?.message ?? e}`);
        }
    };

    const phoneNumberOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const allowCreate: boolean = phoneNumber?.trim().length > 5;

    return (
        <Modal
            title="New Group"
            open={true}
            closable={true}
            maskClosable={false}
            onCancel={onCancel}
            footer={<Button onClick={handleOnClick} disabled={!allowCreate} loading={loading}>Create</Button>}>
            <h2>Please enter full phone number</h2>
            <Space direction="vertical" style={{width: "100%"}}>
                <Input placeholder={"Phone number with code"} value={phoneNumber} onChange={phoneNumberOnChange}
                       disabled={loading}/>
                {!!errorText && <Text type="danger">{errorText}</Text>}
            </Space>
        </Modal>
    );
};

export default CreateNewGroup;
