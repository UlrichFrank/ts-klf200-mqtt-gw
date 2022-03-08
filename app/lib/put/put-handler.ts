import { ActuatorType, Product } from "klf-200-api"
import { log } from "../logger"
import { RollerShutterMessage, toRollerShutter } from "../message/rollershutter-message"

export const putMessage = async (resource: Product, message: Buffer) => {
    if (resource.ProductType == ActuatorType.RollerShutter) {
        // only supported for roller shutter messages at the moment
        try {
            const msg = JSON.parse(message.toString()) as RollerShutterMessage
            const newResource = toRollerShutter(resource, msg) as Product

            try {
                await newResource.setTargetPositionAsync(msg.currentposition);
            }
            catch (e) {
                log.error(e + "\nMessage was:\n" + JSON.stringify(msg, null, 2))
            }
        }
        catch (e) {
            log.error("invalid message", e)
        }
    }
}
