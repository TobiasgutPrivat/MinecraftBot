import mineflayer from "mineflayer";
import { pathfinder, Movements } from "mineflayer-pathfinder";
import Action from "./Action";
import BotState from "./Botstate";

export default class Bot {
    private currentaction?: Action
    bot: mineflayer.Bot
    goals: [number,(botState: BotState) => number][] = [] //list of [weight, goal] tuples

    constructor(name: string) {
        this.bot = mineflayer.createBot({
            username: name
            // default settings
            // host: "127.0.0.1",
            // port: 25565,
            // auth: 'offline',
        });

        this.bot.loadPlugin(pathfinder); // enable pathfinder plugin

        this.bot.once('spawn', () => {
            const defaultMove = new Movements(this.bot)
            this.bot.pathfinder.setMovements(defaultMove);
        })

        this.bot.on('physicTick', () => {
            // Designed to reevaluate every tick
            // alternative: reevaluate on specific triggers (like chat, death, completion, failure)
            this.ReEvaluateActions()
        })
    }

    private ReEvaluateActions() {
        const currentBotState = new BotState(this.bot)
        const [currentEvaluation, actions] = this.getEvaluation(currentBotState)

        var ActionsEvaluation: [Action, number][] = actions.map(action => [action, this.ActionEvaluation(action,currentBotState)])

        const newAction = ActionsEvaluation.sort((a, b) => b[1] - a[1])[0][0]

        if (!this.currentaction || newAction.id !== this.currentaction.id) {
            if (newAction) {
                this.currentaction = newAction
                this.currentaction.run(this.bot)
            }
        }
    }

    private getEvaluation(botState: BotState): [number, Action[]] {
        let totalEvaluation = 0;
        const actions: Action[] = [];

        for (const [weight, goalEval] of this.goals) {
            const evaluation = goalEval(botState);
            totalEvaluation += weight * evaluation;
            actions.push(...goalActions);
        }

        return [totalEvaluation, actions];
    }

    private ActionEvaluation(action: Action, botState: BotState): number {
        action.simulateBotState(this.bot)
        const state = new BotState(this.bot)
        const [evaluation, _] = this.getEvaluation(state)
        action.resetSimulateBotState(this.bot)
        return evaluation / action.getEffort(botState.bot)
    }
}