import BotState from "../Botstate";
import Factor from "../Factor";
import { Block, Material } from "minecraft-data";
import EffortItem from "./EffortItem";

export default class EffortMineBlockType extends Factor<number> {
    block: string
    constructor(block: string) {
        super()
        this.block = block
    }
    calculate(botState: BotState): number {
        const block: Block = botState.bot.registry.blocksByName[this.block]
        
        const tools: {name: string, effort: number, multiplier: number}[] = [{name:"None",effort:0,multiplier:1}]
        
        if (block.material) {
            const material: Material = botState.bot.registry.materials[block.material]
            for (const [tool, multiplier] of Object.entries(material)) {
                tools.push({name:tool, effort: new EffortItem(tool).get(botState), multiplier: multiplier})
            }
        }
        
        tools.forEach(tool => {
            if (block.harvestTools && !(tool.name in block.harvestTools)) {
                tool.effort *= 10/3
            }})
            
        const toolEfforts: number[] = tools.map(tool => ((block.hardness? block.hardness : Infinity) / tool.multiplier) + tool.effort) // hardness untested
        
        const mineEffort: number = Math.min(...toolEfforts)

        return mineEffort
    }
}