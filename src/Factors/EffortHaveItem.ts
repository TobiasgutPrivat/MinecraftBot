import BotState from "../Botstate"
import Factor from "../Factor"
import EffortCollectItem from "./EffortCollectItem"
import ItemCost from "./ItemCost"

export default class EffortHaveItem extends Factor<number> {
    itemName: string
    count: number
    constructor(itemName: string, count: number = 1) {
        super()
        this.itemName = itemName
        this.count = count
    }

    calculate(botState: BotState): number {
        const inventoryCount: number = botState.bot.inventory.count(this.itemName, null);
        const remainingCount = this.count - inventoryCount

        const costs = new ItemCost(this.itemName).get(botState)
        
        if (remainingCount <= 0) return remainingCount * costs // using from Inventory has some cost

        // Make item be in Inventory
        const effortCollect: number = new EffortCollectItem(this.itemName, remainingCount).get(botState)
        // or
        // TODO: craftItem
        // or
        // effortLootItem

        // -> maybe change to evaluate all possibilities (craft, collect, mine, kill -> array of [effort, count]) and choose best combination

        const effort: number = effortCollect

        // No direct influence from Actions

        return effort
    }
}