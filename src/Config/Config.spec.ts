import { parse } from "@ulrichfrank/ts-mqtt-gateway";
import { Config } from "./Config";

beforeAll(async () => {
});

afterAll(async () => {
});

test('load_config', () => {
    var config : Config = parse("./example_config.json", Config);
    expect(config.klf200.getHost()).toBe("velux");
    expect(config.klf200.getPassword()).toBe("pass");
    expect(config.mqtt.getUrl()).toBe("mqtt://broker.net");
});