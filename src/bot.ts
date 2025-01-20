import mineflayer from "mineflayer";
import { pathfinder, Movements } from "mineflayer-pathfinder";
import Action from "./Action";
import BotState from "./Botstate";

export default class Bot {
    private currentaction?: Action
    readonly bot: mineflayer.Bot
    goals: [number,(botState: BotState) => number][] = [] //list of [weight, rateGoal()] tuples
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
        });

        this.bot.on("physicTick", () => this.reEvaluateActions());
    }
    private reEvaluateActions() {
        const currentBotState = new BotState(this.bot)
        const currentScore = this.BotStateScore(currentBotState)

        var actionScores: [Action, number][] = currentBotState.actionSuggestions.map(
            action => [action, this.ActionScore(action)]
        )
        // maybe include wait Action

        if (actionScores.length == 0) return
        
        const bestAction = actionScores.sort((a, b) => b[1] - a[1])[0][0]

        if (!this.currentaction || bestAction.id !== this.currentaction.id) {
            this.currentaction?.stop(this.bot)
            this.currentaction = bestAction
            this.bot.chat("Running " + this.currentaction.id)
            this.currentaction.run(this.bot).then(() => this.currentaction = undefined) // test what happens if currentaction already changed, or just don't remove
        }
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
        return score / action.getEffort(this.bot)
    }
}