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

            while (true) {
                this.tpsScoreboard?.tick();
                this.reEvaluateActions();
            }
        });
    }

    private reEvaluateActions(): void {
        if (this.currentaction?.stopped) {
            this.currentaction = undefined
        }

        const bestAction = this.getBestAction()

        if (!this.currentaction || bestAction.id !== this.currentaction.id) {
            this.currentaction?.stop(this.bot) //maybe not needed
            this.currentaction = bestAction
            this.bot.chat("Running " + this.currentaction.id)
            this.currentaction.run(this) // test what happens if currentaction already changed, or just don't remove
        }
    }

    private getBestAction(): Action {
        const actions: [Action, number][] = [] //action, importance

        for (const goal of this.goals) {
            actions.push(...goal.getActionImportance(this, 1)) //maybe consider priority of goals
        }

        const actionCurrentGain: [Action, number][] = actions.map((action) => [action[0], action[1] * action[0].getTotalEffortFuture(this) / action[0].getEffortNow(this.bot)])  //importance * effort future / effort now

        //get highest gain
        const bestAction: Action = actionCurrentGain.sort((a, b) => b[1] - a[1])[0][0]

        return bestAction
    }
}