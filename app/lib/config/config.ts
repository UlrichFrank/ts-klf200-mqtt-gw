import * as fs from "fs"

export type ConfigMqtt = {
    url: string
    topic: string
    username?: string
    password?: string
    retain: boolean
    qos: (0|1|2)
    "bridge-info"?: boolean
    "bridge-info-topic"?: string
}

export type ConfigVelux = {
    host: string
    password: string
    fingerprint: string
    ca: string
}

export type Config = {
    mqtt: ConfigMqtt
    velux: ConfigVelux
    names: any,
    "send-full-update": boolean
}

let appConfig: Config

const mqttDefaults = {
    qos: 1,
    retain: true,
    "bridge-info": true
}

const veluxDefaults = {
    fingerprint: "12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0:12:34:56:78",
    ca: "velux-cert.pem",
    password: "velux123"
}

const configDefaults = {
    "send-full-update": true
}

export const applyDefaults = (config: any) => {
    return {
        ...configDefaults,
        ...config,
        velux: { ...veluxDefaults, ...config.velux },
        mqtt: { ...mqttDefaults, ...config.mqtt },
        names: config.names ?? {}
    } as Config
}

export const loadConfig = (file: string) => {
    const buffer = fs.readFileSync(file)
    applyConfig(JSON.parse(buffer.toString()))
}

export const applyConfig = (config: any) => {
    appConfig = applyDefaults(config)
}

export const getAppConfig = () => {
    return appConfig
}

export const setTestConfig = (config: Config) => {
    appConfig = config
}
