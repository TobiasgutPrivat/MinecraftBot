import mineflayer from 'mineflayer'
import Action from '../Action'
import { Recipe, RecipeItem } from 'prismarine-recipe';
import { REACHDISTANCE } from '../Constants';
import ItemCreater, { Item } from "prismarine-item"

export default class Craft extends Action {
    recipe: Recipe
    count: number
    constructor(recipe: Recipe, count: number = 1) {
        super("Craft" + recipe.result.id + " " + count)
        this.recipe = recipe
        this.count = count
    }

    canRun(bot: mineflayer.Bot): boolean {
        if (this.recipe.requiresTable) {
            if (!bot.findBlock({ matching: bot.registry.blocksByName["crafting_table"].id , maxDistance: REACHDISTANCE})) return false
        }
        for (const item of this.recipe.delta) {
            if (bot.inventory.count(item.id, null) < item.count) return false
        }
        return true
    }

    run(bot: mineflayer.Bot): void {
        if (this.recipe.requiresTable) {
            const crafting_table = bot.findBlock({ matching: bot.registry.blocksByName["crafting_table"].id, maxDistance: REACHDISTANCE })
            if (!crafting_table) return
            bot.craft(this.recipe, this.count, crafting_table)
        } else {
            bot.craft(this.recipe, this.count)
        }
    }

    getEffort(bot: mineflayer.Bot): number {
        return 0
    }

    simulate(bot: mineflayer.Bot): void {
        const ItemType = ItemCreater(bot.version)
        
        for (const item of this.recipe.delta.filter(item => item.count < 0)) {
            bot.inventory.clear(item.id, -item.count * this.count)
        }
        bot.inventory.fillAndDump(new ItemType(this.recipe.result.id, this.recipe.result.count * this.count), 9, 45, true)
    }

    resetSimulation(bot: mineflayer.Bot): void {
        const ItemType = ItemCreater(bot.version)

        bot.inventory.clear(this.recipe.result.id, this.recipe.result.count * this.count)
        for (const item of this.recipe.delta.filter(item => item.count < 0)) {
            bot.inventory.fillAndDump(new ItemType(item.id, -item.count * this.count), 9, 45, true)
        }
    }

    stop(bot: mineflayer.Bot): void {
        return
    }

    isRunning(bot: mineflayer.Bot): boolean {
        return false
    }
}