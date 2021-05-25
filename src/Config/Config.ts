import { ConfigMqtt } from "@ulrichfrank/ts-mqtt-gateway/dist/config/ConfigMqtt";
import { JsonProperty, Serializable } from "typescript-json-serializer";
import { ConfigKlf200 } from "./ConfigKlf200";

@Serializable()
export class Config {
    public constructor(
        @JsonProperty({ name: "mqtt", required : true })
        public mqtt: ConfigMqtt,

        @JsonProperty({ required : true })
        public klf200: ConfigKlf200
    ) {
    }
    public getMqtt() : ConfigMqtt {
        return this.mqtt;
    }

    public getKlf200() : ConfigKlf200 {
        return this.klf200;
    }
}