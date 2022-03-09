import { cleanTopic } from "../topic/topic-utils"
import { log } from "../logger"
import { publishResource } from "./state-event-handler"
import { getAppConfig } from "../config/config"
import { ActuatorType, Connection, Group, Groups, Product, Products } from "klf-200-api"


export class StateManager {
    _typedResources = new Map<ActuatorType, Product>()

    resourcesByTopic = new Map<string, Product>()
    productByNodeId = new Map<number, Product>()
    groupByNodeId = new Map<number, Group>()

    setProducts = (products: Product[]) => {
        log.info("Init Products")
        for (const product of products) {
            log.info(`add product: ${product.Name}`)
            this.productByNodeId.set(product.NodeID, product)
        }
    }

    setGroups = (groups: Group[]) => {
        log.info("Init Groups")
        for (const group of groups) {
            log.info(`add group: ${group.Name}`)
            for (const nodeId of group.Nodes) {
                this.groupByNodeId.set(nodeId, group);
            }
        }
    }

    getTyped = () => {
        return this._typedResources
    }

    addTypedResources = (resources: Product[]) => {
        for (const resource of resources) {
            this._typedResources.set(resource.TypeID, resource)
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
    log.info("Init Statemanager")
    const products = await Products.createProductsAsync(conn);
    if (products) {
        state.setProducts(products.Products)
    }
    const groups = await Groups.createGroupsAsync(conn);
    if (groups) {
        state.setGroups(groups.Groups);
    }


    state.addTypedResources(products.Products)

    await updateAll()
}

const getNameProvider = (resource: Product) => {
    return state.productByNodeId.get(resource.NodeID)
}

const mapName = (resource: Product) => {
    const customName = getAppConfig()?.names[resource.NodeID]
    if (customName != null) {
        return customName
    }
    return resource.Name
}

export const getTopic = (resource: Product) => {
    let prefix = "";

    prefix = state.groupByNodeId.get(resource.NodeID)?.Name ?? "unassigned";

//    return cleanTopic(`${prefix}/${mapName(resource)}`)
    return cleanTopic(`${prefix}/${resource.Name}`)
}

export const state = new StateManager()
