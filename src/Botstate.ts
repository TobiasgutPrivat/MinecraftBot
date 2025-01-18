import mineflayer from "mineflayer"
import Action from "./Action";
import Factor from "./Factor";

export default class BotState { //only allowed to be used for 1 evaluation
    readonly bot: mineflayer.Bot
    cache: Map<string, unknown> = new Map();
    actionSuggestions: Action[] = []
    
    constructor(bot: mineflayer.Bot) {
        this.bot = bot
    }

    calc<T>(factor: Factor<T>): T {
        return factor.get(this)
    }
}

// for simulation of state
// option 1: you could modify and reset things again in bot -> maybe issue when something get's updated during process -> currently chosen
// option 2: clone data like inventory -> maybe serializing and deserializing or using lodash.cloneDeep -> bad performance

