import {FC, useState} from 'react';
import {InstanceConfig} from "./common/types/InstanceConfig.ts";
import SignInUser from "./components/signInUser/SignInUser.tsx";
import MessengerView from "./components/messengerView/MessengerView.tsx";
import './App.css';

const App: FC = () => {
    const [instanceConfig, setInstanceConfig] = useState<InstanceConfig | undefined>();

    const handleOnOk = (cfg: InstanceConfig) => {
        setInstanceConfig(cfg);
    };

    const handleOnLogout = () => {
        setInstanceConfig(undefined);
    };

    return (
        <>
            {!instanceConfig && <SignInUser onOk={handleOnOk}/>}
            {instanceConfig && <MessengerView instanceConfig={instanceConfig} onLogout={handleOnLogout}/>}
        </>
    )
}

export default App;
