import { ConfigMqtt } from "@ulrichfrank/ts-mqtt-gateway/dist/config/ConfigMqtt";
import { ConfigKlf200 } from "./ConfigKlf200";
import { jsonObject, jsonMember, TypedJSON } from 'typedjson';

@jsonObject
export class Config {
    @jsonMember(ConfigMqtt)
    public mqtt!: ConfigMqtt;

    @jsonMember(ConfigKlf200)
    public klf200!: ConfigKlf200;
}