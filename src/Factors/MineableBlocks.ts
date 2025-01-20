import BotState from "../Botstate";
import Factor from "../Factor";
import {Block, Material} from "minecraft-data";
import EffortItem from "./EffortItem";
import EffortGetToPos from "./EffortGetToPos";
import { REACHDISTANCE } from "../Constants";
import EffortMineBlockType from "./EffortMineBlockType";
import { MineBlock } from "../Actions/MineBlock";

export default class MineableBlocks extends Factor<{effort: number, count: number}[]> {
    block: string
    constructor(block: string) {
        super()
        this.block = block
    }

    calculate(botState: BotState): {effort: number, count: number}[] {
        const block: Block = botState.bot.registry.blocksByName[this.block]
        
        const mineEffort: number = new EffortMineBlockType(this.block).calculate(botState)

        const blocks = botState.bot.findBlocks({ matching: block.id, maxDistance: 32 }) //Think about distance and how to find best options, but not too many

        const mineableBlocks: {effort: number, count: number}[] = blocks.map(block => {
            const effortPos = new EffortGetToPos(block, REACHDISTANCE).get(botState)
            if (effortPos === 0) {this.suggestAction(new MineBlock(this.block))}
            return {
                effort:  + mineEffort,
                count: 1
            }})

        return  mineableBlocks
    }
}