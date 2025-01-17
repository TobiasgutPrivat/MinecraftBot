import Action from "../Action";
import mineflayer from "mineflayer";
import { goals } from "mineflayer-pathfinder";
import BotState from "../Botstate";

const GoalNear = goals.GoalNear

const WalkSpeed = 4

export default class GoNearBlock implements Action {
    id: string;
    block: string
    proximity: number
    stopped: boolean
    constructor(block: string, proximity: number) {
        this.id = "GoNearBlock" + block + proximity.toString()
        this.proximity = proximity
        this.block = block
        this.stopped = false
    }
    
    public run(bot: mineflayer.Bot): void {
        const block = bot.findBlock({ matching: (block) => block.name === this.block})
        if (block) {
            bot.pathfinder.setGoal(new GoalNear(block.position.x, block.position.y, block.position.z, this.proximity));
        } else {
            this.stopped = true
        }
    }

    public canRun(bot: mineflayer.Bot): boolean {
        return bot.findBlock({ matching: (block) => block.name === this.block}) ? true : false
    }

    public getEffort(bot: mineflayer.Bot): number {
        return bot.entity.position.distanceTo(bot.findBlock({ matching: (block) => block.name === this.block})?.position ?? bot.entity.position) / WalkSpeed * 20 //-> ticks
    }

    public stop(bot: mineflayer.Bot): void {
        bot.pathfinder.setGoal(null)
        this.stopped = true
    }

    public simulateBotState(bot: BotState): void {
        bot.position = bot.bot.findBlock({ matching: (block) => block.name === this.block})?.position ?? bot.position
    }
}