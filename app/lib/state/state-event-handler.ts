import { ActuatorAlias, ActuatorType, Product } from "klf-200-api";
import { log } from "../logger";
import { fromRollerShutter } from "../message/rollershutter-message";
import { publish } from "../mqtt/mqtt-client";
import { getTopic } from "./state-manager";
/*
const handleResource = (data: Product) => {
    const oldResource = ""; //get resource from data
    if (oldResource) {
        const newResource = ""; //{ ...oldResource, ...data } as HueIdentifiable

        state._typedResources.set(data.id, newResource)

        publishResource(newResource)
    }
    else {
        log.error(`No resource found with name ${data.Name}`)
    }
}
*/
export const publishResource = (resource: Product) => {
    let message: any
    let topic = getTopic(resource)

    if (resource.ProductType == ActuatorType.RollerShutter) {
        message = fromRollerShutter(resource)
    }
    else {
        topic = `unhandled/${topic}`
        message = resource
    }

    publish(message, topic)
}
/*
export const takeEvent = (event: HueEvent) => {
    for (const data of event.data) {
        handleResource(data)
    }
}
*/