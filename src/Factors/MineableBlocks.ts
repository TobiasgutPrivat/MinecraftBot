import BotState from "../Botstate";
import Factor from "../Factor";
import {Block, Material} from "minecraft-data";
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
        const mineEffort: number = new EffortMineBlockType(this.block).calculate(botState)

        const blocks: Vec3[] = this.getViableBlocksToMine(botState) //Think about distance and how to find best options, but not too many

        const mineableBlocks: {effort: number, count: number}[] = blocks.map(block => {
            const effortPos = new EffortGetToPos(block, REACHDISTANCE).get(botState)
            if (effortPos === 0) {this.suggestAction(new MineBlock(this.block))}
            return {
                effort:  + mineEffort,
                count: 1
            }})

        return  mineableBlocks
    }

    getViableBlocksToMine(botState: BotState): Vec3[] {
        const block: Block = botState.bot.registry.blocksByName[this.block]
        var blocks: Vec3[] = []
        var range: number = 1
        while (blocks.length < this.goalCount) {
            blocks = botState.bot.findBlocks({ matching: block.id, maxDistance: range });
            range *= 2;
        }

        return blocks
    }
}