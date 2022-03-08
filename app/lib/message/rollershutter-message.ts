import { Product } from "klf-200-api"

export type RollerShutterMessage = {
    currentposition: number,
    targetposition: number,
    "last-updated": string
}

export const fromRollerShutter = (rollershutter: Product) => {
    const message: RollerShutterMessage = {
        currentposition: rollershutter.CurrentPosition,
        targetposition: rollershutter.TargetPosition,
        "last-updated": new Date().toISOString()
    }

    return message
}

export const toRollerShutter = (template: Product, message: RollerShutterMessage) => {
    const result = { ...template }
/*
    result.on.on = message.state.toUpperCase() === "ON"
    result.dimming = { brightness: message.brightness }

    if (message.color_temp && template.color_temperature) {
        result.color_temperature = { ...template.color_temperature, mirek: message.color_temp }
        delete result.color
    }
    else if (message.color && template.color) {
        delete result.color_temperature
        delete result.dimming
        result.color = { xy: message.color }
    }
*/
    return result
}