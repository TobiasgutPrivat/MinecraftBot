import Action from "../Action"
import mineflayer from "mineflayer"
import ItemCreater, { Item } from "prismarine-item"
import {Block} from "prismarine-block"

export class MineBlock extends Action {
    block: Block
    drops: Item[] | undefined
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: Block) { //maybe change to Actual Block instance instead of string
        super("MineBlock" + block.position)
        this.block = block;
    }

    canRun(bot: mineflayer.Bot): boolean {
        return bot.canDigBlock(this.block)
    }

    run(bot: mineflayer.Bot): void {
        //TODO: select proper tool
        bot.dig(this.block, true) // forcelook true for more realism
    }

    getEffort(bot: mineflayer.Bot): number {
        // TODO: depends on tool in hand
        return bot.digTime(this.block)
    }

    simulate(bot: mineflayer.Bot): void {
        this.drops = MineBlock.getDrops(bot, this.block);
        for (const itemDrop of this.drops) {
            bot.inventory.fillAndDump(itemDrop, 9, 45, true)
        }
    }

    resetSimulation(bot: mineflayer.Bot): void {
        if (!this.drops) return
        for (const itemDrop of this.drops) {
            bot.inventory.clear(itemDrop.type, itemDrop.count)
        }
        //maybe remove dumped items
    }

    stop(bot: mineflayer.Bot): void {
        bot.stopDigging();
    }

    static getDrops(bot: mineflayer.Bot, block: Block): Item[] {
        const ItemType = ItemCreater(bot.version)
        if (block.drops) {
            return block.drops.map(drop => {
                if (typeof drop === "number") {
                    return new ItemType(drop, 1)
                } else {
                    const max = drop.maxCount ?? 1
                    const min = drop.minCount ?? 1
                    if (typeof drop.drop === "number") {
                        return new ItemType(drop.drop, (max + min) / 2)
                    } else {
                        return new ItemType(drop.drop.id, (max + min) / 2, drop.drop.metadata)
                    }
                }
            })
        } else {
            return []
        }
    }
}