import { cleanTopic } from "../topic/topic-utils"
import { log } from "../logger"
import { publishResource } from "./state-event-handler"
import { getAppConfig } from "../config/config"
import { ActuatorType, Connection, Group, Product, Products } from "klf-200-api"


export class StateManager {
    _typedResources = new Map<ActuatorType, Product>()

    resourcesByTopic = new Map<string, Product>()
    deviceByDeviceId = new Map<number, Product>()

    setDevices = (devices: Product[]) => {
        for (const device of devices) {
            this.deviceByDeviceId.set(device.NodeID, device)
        }
    }

    getTyped = () => {
        return this._typedResources
    }

    addTypedResources = (resources: Product[]) => {
        for (const resource of resources) {
            this._typedResources.set(resource.ProductType, resource)
            const topic = getTopic(resource)
            const fullTopic = `${getAppConfig().mqtt.topic}/${topic}`
            this.resourcesByTopic.set(`${fullTopic}/set`, resource)
            this.resourcesByTopic.set(`${fullTopic}/get`, resource)
            this.resourcesByTopic.set(`${fullTopic}/state`, resource)
        }
    }
}

const updateAll = async () => {
    if (getAppConfig()["send-full-update"]) {
        log.info("Sending full update")

        for (const resource of state.getTyped().values()) {
            publishResource(resource)
        }
        log.info("Sending full update done")
    }
}

export const initStateManagerFromVelux = async (conn: Connection) => {
    const products = await Products.createProductsAsync(conn);
    if (products) {
        state.setDevices(products.Products)
    }

    state.addTypedResources(products.Products)

    await updateAll()
}

const getNameProvider = (resource: Product) => {
    return state.deviceByDeviceId.get(resource.NodeID)
}

const mapName = (resource: Product) => {
    const customName = getAppConfig()?.names[resource.NodeID]
    if (customName != null) {
        return customName
    }
/*
    const nameProvider = (isNameable(resource) ? resource : getNameProvider(resource))
    if (isNameable(nameProvider)) {
        return nameProvider.metadata.name
    }
    else {
        return resource.id
    }*/
    return resource.Name
}

export const getTopic = (resource: Product) => {
    let prefix = "";
/*
    if (isLight(resource)) {
        const room = state.roomByResourceId
            .get(resource.owner.rid)?.metadata
            .name ?? "unassigned"
        prefix = `${prefix}/${room}`
    }
*/
//    return cleanTopic(`${prefix}/${mapName(resource)}`)
    return cleanTopic(`${prefix}/${resource}`)
}

export const state = new StateManager()
