import BotState from "../Botstate"
import Factor from "../Factor"
import EffortCollectItem from "./EffortCollectItem"

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

        const costs = 0 // TODO: evaluate item cost
        
        if (remainingCount <= 0) return remainingCount * costs

        // Make item be in Inventory
        const effortCollect: number = botState.calc(new EffortCollectItem(this.itemName, remainingCount))
        // or
        // effortLootItem

        const effort: number = effortCollect

        // No direct influence from Actions

        return effort
    }
}