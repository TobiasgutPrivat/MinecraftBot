import mineflayer from "mineflayer";
import { pathfinder, Movements } from "mineflayer-pathfinder";
import Action from "./Action";
import BotState from "./Botstate";
import TpsScoreboard from "./TpsScoreboard";

export default class Bot {
    private currentaction?: Action
    readonly bot: mineflayer.Bot
    goals: [number,(botState: BotState) => number][] = [] //list of [weight, rateGoal()] tuples
    private tpsScoreboard?: TpsScoreboard;
    private isEvaluating: boolean = false
    //maybe make bot private

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
            if (!this.currentaction?.isRunning(this.bot)) this.currentaction = undefined

            const currentBotState = new BotState(this.bot)
            const currentScore = this.BotStateScore(currentBotState)

            const actionSuggestions = currentBotState.actionSuggestions.filter(action => action.canRun(this.bot))

            // actionScores = [action, scoreImprovement, effort]
            var actionScores: [Action, number, number][] = actionSuggestions.map(action => 
                {
                    const actionScore = this.ActionScore(action)
                    const actionEffort = action.getEffort(this.bot)
                    return [action, actionScore - currentScore, actionEffort] //note: for progress stuff without other goals diffrence should be similair to effort
                }
            )
            // maybe include wait Action

            if (actionScores.length == 0) return
            
            const sortedAction = actionScores.sort((a, b) => {
                const diffrence = (b[1]/b[2]) - (a[1]/a[2])
                if (Math.abs(diffrence) < 0.001) {
                    return diffrence
                } else {
                    return a[2] - b[2]
                }
            }) //compare score/effort

            const minImprovement = 0.1

            var bestAction = sortedAction[0][0]

            if (this.currentaction) {
                const currentEval = this.ActionScore(this.currentaction) - currentScore / this.currentaction.getEffort(this.bot)
                const bestEval = sortedAction[0][1] / sortedAction[0][2]
                if (bestEval - currentEval < minImprovement) {
                    bestAction = this.currentaction
                }
            }

            if (!this.currentaction || bestAction.id !== this.currentaction.id) {
                this.currentaction?.stop(this.bot) //maybe not needed
                this.currentaction = bestAction
                this.bot.chat("Running " + this.currentaction.id)
                this.currentaction.run(this.bot) // test what happens if currentaction already changed, or just don't remove
            }

            resolve()
        })
    }

    private BotStateScore(botState: BotState): number {
        let totalScore = 0;

        for (const [weight, rateGoal] of this.goals) {
            const score = rateGoal(botState);
            totalScore += weight * score;
        }

        return totalScore;
    }

    private ActionScore(action: Action): number {
        action.simulate(this.bot)
        //TODO: simulate passive changes
        const state = new BotState(this.bot)
        const score = this.BotStateScore(state)
        action.resetSimulation(this.bot)
        return score
    }
}