import Action from "../action"
import mineflayer from "mineflayer"
import NearBlock from "../Requirements/NearBlock"

const ReachDistance = 4 //TODO: Hardcoded, maybe calculate

export class MineBlock extends Action {
    block: string
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string) {
        super([new NearBlock(block, ReachDistance)])//TODO: CanMineBlock (maybe tool required)
        this.block = block;
    }

    run(bot: mineflayer.Bot): void {
        const block = bot.findBlock({ matching: (block) => block.name === this.block , maxDistance: ReachDistance})
        if (!block) {
            this.status = "failed"
            return
        } else {
            bot.dig(block, true).then(() => {this.status = "finished"}) // forcelook true for more realism
            this.status = "running"
            return
        }
    }

    stopAction(bot: mineflayer.Bot): void {
        bot.stopDigging()
    }
}