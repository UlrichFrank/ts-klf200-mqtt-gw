import { parse } from "@ulrichfrank/ts-mqtt-gateway";
import { Config } from "../src/Config/Config";
import { PathLike, readFileSync, writeFileSync } from 'fs';

import { deserialize, serialize } from "typescript-json-serializer";
import { ConfigKlf200 } from "../src/Config/ConfigKlf200";

beforeAll(async () => {
});

afterAll(async () => {
});

test('load_config', () => {
    parse("./example_config.json", Config);
});