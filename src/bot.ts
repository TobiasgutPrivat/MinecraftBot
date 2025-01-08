import mineflayer from "mineflayer";
import { pathfinder, Movements } from "mineflayer-pathfinder";

import { Action } from "./action";
import { Requirement } from "./requirement";

export default class Bot {
    private currentaction?: Action
    bot: mineflayer.Bot
    private goals: Requirement[] //requirements are like goals (something to achieve, possible through certain actions)

    constructor(name: string) {
        this.bot = mineflayer.createBot({
            username: name
            // default settings
            // host: "127.0.0.1",
            // port: 25565,
            // auth: 'offline',
        });

        this.bot.loadPlugin(pathfinder); // enable pathfinder plugin
        // this.bot.pathfinder.setMovements(new Movements(this.bot));

        this.bot.once('spawn', () => {
            // not functional
            this.bot.chat("Hello World")
        })

        this.bot.on('physicTick', () => {
            // Designed to reevaluate every tick
            // alternative: reevaluate on specific triggers (like chat, death, completion, failure)
            this.ReEvaluateActions()
        })

        this.bot.on('kicked', () => {
            this.bot.connect({ username: name })
        })

        this.goals = []
    }

    addGoal(goal: Requirement) {
        this.goals.push(goal)
    }

    private ReEvaluateActions() {
        //remove completed actions
        if (this.currentaction?.isCompleted?.(this.bot)) {
            this.currentaction = undefined
            this.bot.chat("Completed current action")
        }

        //remove satisfied goals
        const satisfiedGoals: Requirement[] = this.goals.filter((goal) => goal.isSatisfied(this.bot))
        for (const goal of satisfiedGoals) {
            this.goals = this.goals.filter((g) => g !== goal); //TODO log goals
            this.bot.chat("Completed goal")
        }

        //get action to run
        const actiontorun = this.getActionTorun()
        if (actiontorun) {
            this.applyAction(actiontorun)
        } else {
            // this.bot.chat("No action to run")
        }
    }

    private applyAction(action: Action) {
        if (this.currentaction === action) return

        if (this.currentaction) {
            if (this.currentaction?.isActive(this.bot)) {
                this.currentaction.cancel(this.bot)
                this.bot.chat("Aborting current action")
            }
            //TODO log Action
        }

        this.currentaction = action
        this.bot.chat("Starting new action")
        this.currentaction.run(this.bot)
    }

    private getActionTorun(): Action | undefined {
        const requiredActions: Action[] = this.goals.flatMap((goal) => goal.getRequiredActions(this.bot))
        //TODO evaluate what action to run
        return requiredActions[0]
    }

}