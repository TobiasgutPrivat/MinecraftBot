import mineflayer from 'mineflayer'
import Action from '../Action'
import { Recipe, RecipeItem } from 'prismarine-recipe';

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
            if (!bot.findBlock({ matching: bot.registry.blocksByName["crafting_table"].id , maxDistance: 4})) return false
        }
        for (const item of this.recipe.ingredients) {
            if (bot.inventory.count(item.id, null) < item.count) return false
        }
        return true
    }

    run(bot: mineflayer.Bot): void {
        if (this.recipe.requiresTable) {
            const crafting_table = bot.findBlock({ matching: bot.registry.blocksByName["crafting_table"].id, maxDistance: 4 })
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
        bot.craft(this.recipe, this.count)
    }

    resetSimulation(bot: mineflayer.Bot): void {
        bot.craft(this.recipe, this.count)
    }

    stop(bot: mineflayer.Bot): void {
        return
    }

    isRunning(bot: mineflayer.Bot): boolean {
        return false
    }
}