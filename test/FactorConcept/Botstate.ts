import mineflayer from "mineflayer"
import { Vec3 } from "vec3"
import Factor from "./Factor"
import { Item } from "prismarine-item"

export default class BotState {
    bot: mineflayer.Bot
    position: Vec3
    inventorySlots: Array<Item|null>
    factors: Factor[] = []
    constructor(bot: mineflayer.Bot) {
        this.bot = bot
        this.position = bot.entity.position
        this.inventorySlots = bot.inventory.slots

        // for simulation of state
        // option 1: you could modify and reset things again in bot -> maybe issue when something get's updated during process
        // option 2: clone data like inventory -> maybe serializing and deserializing
    }
}