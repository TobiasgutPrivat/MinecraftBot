import BotState from "../Botstate";
import Factor from "../Factor";
import {Blocks, Material} from "minecraft-data";
import { Block } from "prismarine-block";
import { Vec3 } from "vec3";
import EffortGetToPos from "./EffortGetToPos";
import { REACHDISTANCE } from "../Constants";
import EffortMineBlockType from "./EffortMineBlockType";
import { MineBlock } from "../Actions/MineBlock";

export default class MineableBlocks extends Factor<{effort: number, count: number}[]> {
    block: string
    goalCount: number
    constructor(block: string, goalCount: number) {
        super()
        this.block = block
        this.goalCount = goalCount
    }

    calculate(botState: BotState): {effort: number, count: number}[] {
        const mineEffort: number = new EffortMineBlockType(this.block).get(botState)

        const blocks: Block[] = this.getViableBlocksToMine(botState) //Think about distance and how to find best options, but not too many

        const mineableBlocks: {effort: number, count: number}[] = blocks.map(block => {
            const effortPos = new EffortGetToPos(block.position, REACHDISTANCE).get(botState)

            //suggest miningActions for Blocks within Reach
            if (effortPos === 0) {this.suggestAction(new MineBlock(block))}

            return {
                effort: effortPos + mineEffort,
                count: 1
            }})

        return  mineableBlocks
    }

    getViableBlocksToMine(botState: BotState): Block[] {
        var range: number = 2
        
        while (range < 64) { //64 maxsearchdistance
            range *= 2;
            //TODO: find multiple blocks
            const foundBlock = botState.bot.findBlock({ matching: botState.bot.registry.blocksByName[this.block].id, maxDistance: range });
            if (foundBlock) return [foundBlock]
        }

        return []
    }
}