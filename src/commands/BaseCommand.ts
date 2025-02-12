import {InstanceConfig} from "../common/types/InstanceConfig.ts";

export default abstract class BaseCommand<R = any, P = any> {
    constructor(readonly instanceConfig: InstanceConfig) {
    }

    abstract execute(param?: P): Promise<R>;
}
