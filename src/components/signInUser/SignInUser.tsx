import {ChangeEvent, FC, useState} from "react";
import {Button, Input, Modal, Space, Typography} from 'antd';
import {InstanceConfig} from "../../common/types/InstanceConfig.ts";
import {GetSettingsCommand} from "../../commands/GetSettingsCommand.ts";
import {SetSettingsCommand} from "../../commands/SetSettingsCommand.ts";

const {Text} = Typography;

interface Props {
    onOk: (instanceConfig: InstanceConfig) => void;
}

const SignInUser: FC<Props> = ({onOk}: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string | undefined>();
    const [idInstanceText, setIdInstanceText] = useState("");
    const [apiTokenInstanceText, setApiTokenInstanceText] = useState("");

    const handleOnClick = async () => {
        setLoading(true);
        setErrorText(undefined);
        const cfg: InstanceConfig = {
            idInstance: idInstanceText,
            apiTokenInstance: apiTokenInstanceText
        };
        try {
            await new GetSettingsCommand(cfg).execute();
            await new SetSettingsCommand(cfg).execute();
            onOk(cfg);
        } catch (e: any) {
            console.error(e);
            setLoading(false);
            setErrorText(`Can't access green-api: ${e?.message}`);
        }
    };

    const idInstanceOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIdInstanceText(e.target.value);
    };

    const apiTokenInstanceOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setApiTokenInstanceText(e.target.value);
    };

    const allowSignIn: boolean = idInstanceText?.trim().length > 5 && apiTokenInstanceText?.trim().length > 10;

    return (
        <Modal
            title="SignIn"
            open={true}
            closable={false}
            footer={<Button onClick={handleOnClick} disabled={!allowSignIn} loading={loading}>Next</Button>}>
            <h2>Please enter</h2>
            <Space direction="vertical" style={{width: "100%"}}>
                <Text>idInstance:</Text>
                <Input placeholder={"idInstance"} value={idInstanceText} onChange={idInstanceOnChange} disabled={loading}/>
                <Text>apiTokenInstance:</Text>
                <Input placeholder={"apiTokenInstance"} value={apiTokenInstanceText} onChange={apiTokenInstanceOnChange} disabled={loading}/>
                {!!errorText && <Text type="danger">{errorText}</Text>}
            </Space>
        </Modal>
    );
};

export default SignInUser;
