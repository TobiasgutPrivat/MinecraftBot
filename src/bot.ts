import mineflayer from "mineflayer";
import { pathfinder, Movements } from "mineflayer-pathfinder";
import Action from "./Action";
import TpsScoreboard from "./TpsScoreboard";
import Target from "./Target";

export default class Bot {
    private currentaction?: Action
    readonly bot: mineflayer.Bot
    goals: Target[] = []
    private tpsScoreboard?: TpsScoreboard;
    private isEvaluating: boolean = false

    constructor(name: string) {
        this.bot = this.createBot(name);
        this.initializeBot();
    }

    private createBot(name: string): mineflayer.Bot {
        return mineflayer.createBot({
            username: name,
            // Default settings (commented out for flexibility)
            // host: "127.0.0.1",
            // port: 25565,
            // auth: 'offline',
        });
    }

    private initializeBot(): void {
        this.bot.loadPlugin(pathfinder);

        this.bot.once("spawn", () => {
            const defaultMove = new Movements(this.bot);
            this.bot.pathfinder.setMovements(defaultMove);
            this.tpsScoreboard = new TpsScoreboard(this.bot);

            this.bot.on("physicsTick", () => {
                this.tpsScoreboard?.tick();
                if (this.isEvaluating) return
                this.isEvaluating = true
                this.reEvaluateActions().then(() => this.isEvaluating = false)
            })
        });
    }

    private async reEvaluateActions(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.currentaction?.stopped) this.currentaction = undefined

            const bestAction = this.getBestAction()

            if (!this.currentaction || bestAction.id !== this.currentaction.id) {
                this.currentaction?.stop(this.bot) //maybe not needed
                this.currentaction = bestAction
                this.bot.chat("Running " + this.currentaction.id)
                this.currentaction.run(this.bot) // test what happens if currentaction already changed, or just don't remove
            }

            resolve()
        })
    }

    private getBestAction(): Action {
        const actions: [Action, number][] = [] //action, importance

        for (const goal of this.goals) {
            actions.push(...this.getActionsImportance(goal, 1)) //maybe consider priority of goals
        }

        const actionCurrentGain: [Action, number][] = actions.map((action) => [action[0], action[1] * action[0].getEffortFuture(this) / action[0].getEffortNow(this.bot)])  //importance * effort future / effort now

        //get highest gain
        const bestAction: Action = actionCurrentGain.sort((a, b) => b[1] - a[1])[0][0]

        return bestAction
    }

    private getActionsImportance(requirement: Target, importance: number): [Action, number][] {
        const actions: Action[] = []
        for (const action of requirement.getActions(this)) {
            actions.push(action)
        }

        const actionEffort: [Action, number][] = actions.map((action) => [action, this.getActionEffortFuture(action)])

        const lowestEffort: number = Math.min(...actionEffort.map((effort) => effort[1]))

        const actionImportance: [Action, number][] = actionEffort.map((effort) => [effort[0], importance * (1 / (effort[1] / lowestEffort))]) // Importance is reduced if effort is higher than lowest one, maybe 1 / Math.pow(effort[1] / lowestEffort, 2)

        for (const action of actionImportance) {
            if (this.canActionRun(action[0])) {
                actions.push(action[0])
            }
            else {
                for (const requirement of action[0].getRequirements(this)) {
                    actionImportance.push(...this.getActionsImportance(requirement, action[1]))
                }
            }
        }

        return actionImportance
    }

    private getActionEffortFuture(action: Action): number {
        var effort = 0
        effort += action.getEffortFuture(this)
        for (const requirement of action.getRequirements(this)) {
            effort += this.getRequirementEffortFuture(requirement)
        }
        return effort
    }

    private getRequirementEffortFuture(requirement: Target): number {
        var lowestEffort = 0
        for (const action of requirement.getActions(this)) {
            lowestEffort = Math.min(lowestEffort, this.getActionEffortFuture(action))
        }
        return lowestEffort
    }

    private canActionRun(action: Action): boolean {
        for (const requirement of action.getRequirements(this)) {
            if (!requirement.isCompleted(this.bot)) return false
        }
        return true
    }
}