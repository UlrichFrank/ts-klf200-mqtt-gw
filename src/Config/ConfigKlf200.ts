import { Serializable, JsonProperty } from "typescript-json-serializer";

@Serializable()
export class ConfigKlf200 {
    constructor(
        @JsonProperty()
        public password: string,

        @JsonProperty()
        public host: string,

        @JsonProperty({ required : false })
        public fingerprint?: string,
        
        @JsonProperty({ required : false })
        public cert?: string) {
        this.fingerprint = fingerprint?? '12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0:12:34:56:78';
        this.cert = cert?? 'velux-cert.pem';
    }

    public getPassword() : string {
        return this.password;
    }

    public getHost() : string {
        return this.host;
    }

    public getFingerprint() : string | undefined {
        return this.fingerprint;
    }

    public getCert() : string | undefined {
        return this.cert;
    }
}