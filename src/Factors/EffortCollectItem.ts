import BotState from "../Botstate"
import Factor from "../Factor"
import EffortGetToPos from "./EffortGetToPos"
import ItemDrops from "./ItemDrops"
import { REACHDISTANCE } from "../Constants"

export default class CollectableItems extends Factor<{effort: number, count: number}[]> {
    itemName: string
    
    constructor(itemName: string) {
        super()
        this.itemName = itemName
    }

    calculate(botState: BotState): {effort: number, count: number}[] {
        const items = new ItemDrops(this.itemName).get(botState);

        const CollectableItems = items.map(item => { return {
            effort: new EffortGetToPos(item.position, REACHDISTANCE).get(botState), 
            count: (item.metadata[1] as {count: number}).count
        }})

        return CollectableItems
    }
}