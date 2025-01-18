import mineflayer from "mineflayer"
import _ from 'lodash';

export default class BotState {
    bot: mineflayer.Bot
    
    constructor(bot: mineflayer.Bot) {
        this.bot = bot

        // for simulation of state
        // option 1: you could modify and reset things again in bot -> maybe issue when something get's updated during process
        // option 2: clone data like inventory -> maybe serializing and deserializing
        // currently chosen: option 2 using lodash.cloneDeep -> TODO: check performance
    }
}

