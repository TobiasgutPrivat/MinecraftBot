import Action from "../Action"
import mineflayer from "mineflayer"
import ItemCreater, { Item } from "prismarine-item"
import {Block} from "prismarine-block"
import Bot from "../Bot"
import Target from "../Target"
import OwnTool from "../Targets/OwnTool"
import { goals } from "mineflayer-pathfinder"

export class DigBlock extends Action {
    block: string
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string) { //maybe change to Actual Block instance instead of string
        super("MineBlock" + block);
        this.block = block;
    }

    canRun(bot: mineflayer.Bot): boolean {
        const mineBlock = bot.findBlock({ matching: bot.registry.blocksByName[this.block].id, maxDistance: 32 });
        if (!mineBlock) return false
        const standsOnGround = bot.entity.position.y % 0.5 === 0
        return bot.canDigBlock(mineBlock) && standsOnGround
    }

    run(bot: mineflayer.Bot): void {
        const mineBlock = bot.findBlock({ matching: bot.registry.blocksByName[this.block].id, maxDistance: 32 });
        if (!mineBlock) return
        
        bot.pathfinder.goto(new goals.GoalBlock(mineBlock.position.x, mineBlock.position.y, mineBlock.position.z), () => {
            //TODO: select proper tool
            const digPromise = bot.dig(mineBlock, false);
    
            digPromise.then(() => this.stopped = true);
    
            digPromise.catch(() => { // important to catch promise-errors
                this.stopped = true
                bot.chat("Digging aborted")
            });
        })
        
    }

    getEffortNow(bot: mineflayer.Bot): number {
        // maybe change to only calc varying effort
        const mineBlock = bot.findBlock({ matching: bot.registry.blocksByName[this.block].id, maxDistance: 32 });
        if (!mineBlock) return Infinity
        const distance = mineBlock.position.distanceTo(bot.entity.position)
        // TODO: depends on tool in hand
        return (distance * 20 / bot.physics.sprintSpeed) + bot.digTime(mineBlock)
    }

    abortAction(bot: mineflayer.Bot): void {
        bot.stopDigging();
    }

    getEffortFuture(bot: Bot): number {
        //depends on rarity and hardness of block
        return 200
    }

    getRequirements(bot: Bot): Target[] {
        const harvestTools = bot.bot.registry.blocksByName[this.block].harvestTools
        if (harvestTools) {
            return [new OwnTool(Object.keys(harvestTools))]
        }
        return []
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