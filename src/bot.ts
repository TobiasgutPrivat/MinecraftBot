import mineflayer from "mineflayer";
import { pathfinder, Movements } from "mineflayer-pathfinder";

import { Action } from "./action";

export default class Bot {
    private currentAction?: Action
    bot: mineflayer.Bot
    private goals: Action[] //requirements are like goals (something to achieve, possible through certain actions)

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

    addGoal(goal: Action) {
        this.goals.push(goal)
    }

    private ReEvaluateActions() {
        //remove completed actions
        if (this.currentAction?.isCompleted(this.bot)) {
            this.currentAction = undefined
            this.bot.chat("Completed current action")
        }

        //remove satisfied goals
        const satisfiedGoals: Action[] = this.goals.filter((goal) => goal.isCompleted(this.bot))
        for (const goal of satisfiedGoals) {
            this.goals.splice(this.goals.indexOf(goal), 1) //TODO log goals
            this.bot.chat("Completed goal")
        }

        //get action to run
        const actionToRun = this.getActionToRun()
        if (actionToRun) {
            this.applyAction(actionToRun)
        } else {
            // this.bot.chat("No action to run")
        }
    }

    private applyAction(action: Action) {
        if (this.currentAction === action) return

        if (this.currentAction) {
            if (this.currentAction?.isActive(this.bot)) {
                this.currentAction.cancel(this.bot)
                this.bot.chat("Aborting current action")
            }
            //TODO log Action
        }

        this.currentAction = action
        this.bot.chat("Starting new action")
        this.currentAction.run(this.bot)
    }

    private getActionToRun(): Action | undefined {
        const requiredActions: Action[] = this.getRequiredActions(this.goals, this.bot)
        //TODO evaluate what action to run
        return requiredActions[0]
    }

    private getRequiredActions(actions: Action[], bot: mineflayer.Bot): Action[] {
        const actionsToDo = actions
            .filter((req) => !req.isCompleted(bot));

        return actionsToDo
            .filter((req) => req.isRunnable(bot))
            .concat(...actionsToDo
                .filter((req) => !req.isRunnable(bot))
                .map((req) => this.getRequiredActions(req.actions, bot))
            )
    }
}