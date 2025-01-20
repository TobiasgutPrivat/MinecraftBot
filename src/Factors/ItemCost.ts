import BotState from "../Botstate"
import Factor from "../Factor"

export default class ItemCost extends Factor<number> {
    itemName: string

    constructor(itemName: string) {
        super()
        this.itemName = itemName
    }
    
    calculate(botState: BotState): number {
        // TODO: evaluate item cost
        return 0
    }
}