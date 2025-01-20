import Action from "../Action"
import mineflayer from "mineflayer"
import { Item } from "prismarine-item"

const ReachDistance = 4 //TODO: Hardcoded, maybe calculate

export class MineBlock extends Action {
    block: string
    stopped: boolean
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string) { //maybe change to Actual Block instance instead of string
        super("MineBlock" + block)
        this.block = block;
        this.stopped = false
    }

    canRun(bot: mineflayer.Bot): boolean {
        return bot.findBlock({ matching: (block) => block.name === this.block , maxDistance: ReachDistance}) ? true : false
    }

    run(bot: mineflayer.Bot): Promise<void> {
        const block = bot.findBlock({ matching: (block) => block.name === this.block , maxDistance: ReachDistance})
        if (!block) {
            this.stopped = true
            return Promise.resolve()
        } else {
            return bot.dig(block, true) // forcelook true for more realism
        }
    }

    getEffort(bot: mineflayer.Bot): number {
        const block = bot.findBlock({ matching: (block) => block.name === this.block , maxDistance: ReachDistance})
        if (block) {
            return bot.digTime(block) // TODO: depends on tool in hand
        } else {
            return Infinity
        }
    }

    simulate(bot: mineflayer.Bot): void {
        bot.inventory.fillAndDump(new Item(bot.registry.blocksByName[this.block].id, 1), 9, 45, true)
    }

    resetSimulation(bot: mineflayer.Bot): void {
        bot.inventory.clear(bot.registry.blocksByName[this.block].id, 1)
        //maybe remove dumped items
    }

    stop(bot: mineflayer.Bot): void {
        bot.stopDigging()
        this.stopped = true
    }
}