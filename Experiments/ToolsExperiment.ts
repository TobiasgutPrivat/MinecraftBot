import mineflayer from "mineflayer"
import MCData, { Item, Block, Material } from "minecraft-data"

const ToolMultiplier = {"none": 1, "wooden": 2, "stone": 4, "iron": 6, "gold": 12, "diamond": 8, "netherite": 9};

export function getEffectiveTools(bot: mineflayer.Bot, block: Block): {item: Item, power: number}[] {
    if (!block.material) {return[]}

    const material: Material = bot.registry.materials[block.material]
    const effectivenes: number = stone["stone_pickaxe"]
    return 
}

export function getToolPower(tool: Item): number {
    
}