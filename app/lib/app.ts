import { connectMqtt } from "./mqtt/mqtt-client"
import { log } from "./logger"
import cron from "node-cron"
import { initStateManagerFromVelux } from "./state/state-manager"
import { Connection } from "klf-200-api"
import { getAppConfig } from "./config/config"

export const triggerFullUpdate = async () => {
        log.info("Updating devices")
    
    const config = getAppConfig();
    const conn = new Connection(config.velux.host);
    try {
        await conn.loginAsync(config.velux.password);
        await initStateManagerFromVelux(conn);
    } 
    catch (e) {
        log.info(`Error updating devices ${e}`)
    } finally {
        await conn.logoutAsync();
    }
    log.info("Updating devices done")
}

export const startApp = async () => {
    const mqttCleanUp = await connectMqtt()

    await triggerFullUpdate()

    log.info("Application is now ready.")

    log.info("Scheduling full-update every minute.")
    const task = cron.schedule("0 * * * *", triggerFullUpdate)
    task.start()

    return () => {
        mqttCleanUp()
        task.stop()
    }
}
