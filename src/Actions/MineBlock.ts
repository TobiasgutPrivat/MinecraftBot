import Action from "../Action"
import mineflayer from "mineflayer"
import BotState from "../Botstate"

const ReachDistance = 4 //TODO: Hardcoded, maybe calculate

export class MineBlock implements Action {
    id: string
    block: string
    stopped: boolean
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string) {
        this.id = "MineBlock" + block
        this.block = block;
        this.stopped = false
    }

    canRun(bot: mineflayer.Bot): boolean {
        return bot.findBlock({ matching: (block) => block.name === this.block , maxDistance: ReachDistance}) ? true : false
    }

    run(bot: mineflayer.Bot): void {
        const block = bot.findBlock({ matching: (block) => block.name === this.block , maxDistance: ReachDistance})
        if (!block) {
            this.stopped = true
        } else {
            bot.dig(block, true).then(() => {this.stopped = true}) // forcelook true for more realism
        }
    }

    getEffort(bot: mineflayer.Bot): number {
        return 50 // ticks, depends on dig time
        const block = bot.findBlock({ matching: (block) => block.name === this.block , maxDistance: ReachDistance})
        if (block) {
            bot.digTime(block) // try out maybe depends on tool
        }
    }

    simulateBotState(bot: BotState): void {
        bot.bot.getControlState('')
    }

    stop(bot: mineflayer.Bot): void {
        bot.stopDigging()
        this.stopped = true
    }
}