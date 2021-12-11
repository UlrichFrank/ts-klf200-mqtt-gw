import { jsonObject, jsonMember, TypedJSON } from 'typedjson';

@jsonObject
export class ConfigKlf200 {
        @jsonMember(String)
        public password?: string;

        @jsonMember(String)
        public host?: string;

        @jsonMember(String)
        public fingerprint?: string = '12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0:12:34:56:78';
        
        @jsonMember(String)
        public cert?: string = 'velux-cert.pem';
}