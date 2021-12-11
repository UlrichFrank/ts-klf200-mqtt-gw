import { parse } from "@ulrichfrank/ts-mqtt-gateway";
import { Config } from "./Config";

beforeAll(async () => {
});

afterAll(async () => {
});

test('load_config', () => {
    let config : Config = parse("./example_config.json", Config);
    expect(config.klf200.host).toBe("velux");
    expect(config.klf200.password).toBe("pass");
    expect(config.mqtt.url).toBe("mqtt://broker.net");
});