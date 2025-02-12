import {InstanceConfig} from "../common/types/InstanceConfig.ts";

export default abstract class BaseCommand<R = any, P = any, V = any> {
    constructor(readonly instanceConfig: InstanceConfig) {
    }

    abstract execute(param1?: P, param2?: V): Promise<R>;
}
