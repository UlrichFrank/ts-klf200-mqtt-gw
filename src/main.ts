import { Connection, Products, Product } from "klf-200-api";
import express from "express";
import dotenv from "dotenv-defaults";
import { readFileSync } from "fs";
import { factory } from "./ConfigLog4j";
import {} from "ts-mqtt-gateway";


const LOGGER = factory.getLogger("ts-klf200-mqtt-gw");

/*
    Use either the IP address or the name of *your* interface
    'velux-klf-12ab' is just a placeholder in this example.
*/
dotenv.config();
console.log(process.env.HOST);
console.log(process.env.PASSWORD);
console.log(process.env.FINGERPRINT);
console.log(process.env.CA);


class Main {

    private constructor() {
    }

    public static start(config: Config) {
        LOGGER.debug("Debug enabled");
        LOGGER.info("Info enabled");

        try {
            var client = GwMqttClient.start(config.getMqtt()
                .setDefaultTopic("hue")
            );

            client.subscribe(config.getMqtt().getTopic() + "/light/#");
            client.online();

            final var hue = new HueAbstractionImpl(
                new Hue(HueBridgeProtocol.HTTP,
                    config.getHue().getHost() + ":" + config.getHue().getPort(),
                    config.getHue().getApiKey()));

            final var service = HueService.start(hue,
                config.getMqtt().getTopic());

            Events.register(service);
        } catch (final Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
}

System.exit(1);

const host = process.env.HOST?? 'velux-klf-12ab';
const fingerprint = process.env.FINGERPRINT?? '12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0:12:34:56:78';
const password = process.env.PASSWORD?? 'velux123';

var ca : Buffer | undefined;
try { ca = readFileSync(process.env.CA?? 'velux-cert.pem') }
catch(error) {
    console.log(error);
}

const conn = new Connection(host, ca, fingerprint);

const app = express()
const port = 3000

app.get('/', async (req, res) => {
    res.send('Connecting to KLF200:')
    try {
        MiSchroe();
    } catch(error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

async function MiSchroe() {
    try {
        await conn.loginAsync(password);

        const myProducts = await Products.createProductsAsync(conn);
        myProducts.Products.forEach(element => console.log(element.Name));

        const myKitchenWindow = myProducts.findByName("office");
        if (myKitchenWindow) {
            await myKitchenWindow.setTargetPositionAsync(0.5);
        } else {
            throw(new Error("Could not find kitchen window."));
        }
    }  finally {
        await conn.logoutAsync();
    }    
}