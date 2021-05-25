import { Connection, Products, Product } from "klf-200-api";
import express from "express";
import { readFileSync } from "fs";
import { factory } from "./ConfigLog4j";
import { GwMqttClient } from "@ulrichfrank/ts-mqtt-gateway";
import { Config } from "./Config/Config";
import { Klf200Service } from "./Klf200CService";


const LOGGER = factory.getLogger("ts-klf200-mqtt-gw");

/*
    Use either the IP address or the name of *your* interface
    'velux-klf-12ab' is just a placeholder in this example.
*/

class Main {

    private constructor() {
    }

    public static start(config: Config) {
        LOGGER.debug("Debug enabled");
        LOGGER.info("Info enabled");

        try {
            var client = GwMqttClient
                .start(config.getMqtt()
                //.setDefaultTopic("velux")
            );

            //client.subscribe(config.getMqtt().getTopic() + "/light/#");
            client.online();

            new Klf200Service(config.getKlf200()).start();
        } catch (error) {
            LOGGER.error(error);
        }
    }
}
