import mineflayer from "mineflayer";

import {pathfinder} from "mineflayer-pathfinder";

import {Movements, goals} from "mineflayer-pathfinder";
import Action from "./action";
const {GoalFollow} = goals

export default class Bot {
    currentaction?: Action = undefined
    bot: mineflayer.Bot
    constructor(name: string) {
        this.bot = mineflayer.createBot({
            username: name
        });


        this.bot.loadPlugin(pathfinder); //enable pathfinder plugin
        this.bot.pathfinder.setMovements(new Movements(this.bot));

        this.bot.once('spawn', () => {
            this.bot.chat("Hello World")
        })

        this.bot.on('physicTick', () => {
            this.ReEvaluateActions()
        })
    }

    ReEvaluateActions() {
        const actiontorun = this.getActionTorun()
        if (actiontorun) {
            this.applyAction(actiontorun)
        }
    }

    applyAction(action: Action) {
        if (this.currentaction === action) return

        if (this.currentaction) {
            if (this.currentaction?.isActive()) {
                this.bot.chat("Aborting current action")
                this.currentaction.cancel()
            }
        }

        this.currentaction = action
        this.bot.chat("Starting new action")
    }

    getActionTorun() : Action | undefined {
        //evaluate what action to run$
        return undefined
    }

}