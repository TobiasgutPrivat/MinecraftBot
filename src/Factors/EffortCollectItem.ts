import BotState from "../Botstate"
import Factor from "../Factor"
import EffortGetToPos from "./EffortGetToPos"
import ItemDrops from "./ItemDrops"
import { REACHDISTANCE } from "../Constants"

export default class EffortCollectItem extends Factor<number> {
    itemName: string
    count: number
    constructor(itemName: string, count: number = 1) {
        super()
        this.itemName = itemName
        this.count = count
    }

    calculate(botState: BotState): number {
        const items = new ItemDrops(this.itemName).get(botState);

        var effortCollectItems = 0
        var sumCollectedItems = 0

        for (const item of items) {
            effortCollectItems += new EffortGetToPos(item.position, REACHDISTANCE).get(botState)
            sumCollectedItems += (item.metadata[1] as {count: number}).count
            if (this.count <= sumCollectedItems) { 
                return effortCollectItems 
            }
        }

        const remainingCount = this.count - sumCollectedItems

        // calc effort to make new drops from blocks or mobs + collect(already nearby)

        // find cheapest combination of efforts

        return 0
    }
}