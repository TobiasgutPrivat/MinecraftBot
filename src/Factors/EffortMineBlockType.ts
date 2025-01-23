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
                const toolItemName = botState.bot.registry.items[Number.parseInt(tool)].name
                tools.push({name:toolItemName, effort: new EffortItem(toolItemName).get(botState), multiplier: multiplier})
            }
        }
        
        tools.forEach(tool => {
            if (block.harvestTools) {
                tool.effort = Infinity // time *= 10/3, but doesn't drop item in that case i think
            }})

        const MiningMultiplier = 40 // figure this out
            
        const toolEfforts: number[] = tools.map(tool => (block.hardness? block.hardness : Infinity) / tool.multiplier * MiningMultiplier + tool.effort) // hardness untested
        
        const mineEffort: number = Math.min(...toolEfforts)

        return mineEffort
    }
}