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

            this.mainLoop();
        });
    }

    //always reEvaluate, max 1 time per tick
    private async mainLoop() {
        while (true) {
            const startTime = Date.now()
            this.reEvaluateActions()
            const durration = Date.now() - startTime
            console.log("Duration " + durration)
            await this.bot.waitForTicks(1)
        }
    }

    private reEvaluateActions() {
        const currentBotState = new BotState(this.bot)
        const currentScore = this.BotStateScore(currentBotState)

        var actionScores: [Action, number, number][] = currentBotState.actionSuggestions.map(
            action => [action, this.ActionScore(action), action.getEffort(this.bot)]
        )
        // maybe include wait Action

        if (actionScores.length == 0) return
        
        const bestAction = actionScores.sort((a, b) => (b[1]/b[2]) - (a[1]/a[2]))[0][0] //compare score/effort

        if (!this.currentaction || bestAction.id !== this.currentaction.id) {
            // this.currentaction?.stop(this.bot) //maybe not needed
            this.currentaction = bestAction
            this.bot.chat("Running " + this.currentaction.id)
            this.currentaction.run(this.bot) // test what happens if currentaction already changed, or just don't remove
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