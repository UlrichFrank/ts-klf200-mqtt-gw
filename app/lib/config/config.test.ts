import { applyDefaults } from "./config"

describe("Config", () => {
    test("default values", async () => {
        const config = {
            mqtt: {
                url: "tcp://192.168.1.1:1883",
                topic: "velux"
            },
            velux: {
                host: "192.168.1.1",
                password: "text"
            }
        }

        expect(applyDefaults(config)).toStrictEqual({
            velux: {
                password: "text",
                host: "192.168.1.1",
                ca: "velux-cert.pem",
                fingerprint: "12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0:12:34:56:78"
            },
            mqtt: {
                "bridge-info": true,
                qos: 1,
                retain: true,
                topic: "velux",
                url: "tcp://192.168.1.1:1883"
            },
            names: {},
            "send-full-update": true
        })

        expect(applyDefaults(config)["send-full-update"]).toBeTruthy()
    })

    test("disable send-full-update", async () => {
        const config = {
            mqtt: {
                url: "tcp://192.168.1.1:1883",
                topic: "velux"
            },
            velux: {
                host: "192.168.1.1",
                ca: "velux-cert.pem",
                fingerprint: "12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0:12:34:56:78"
            },
            "send-full-update": false
        }

        expect(applyDefaults(config)["send-full-update"]).toBeFalsy()
    })
})
