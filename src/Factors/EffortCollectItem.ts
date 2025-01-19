import BotState from "../Botstate"
import Factor from "../Factor"

export default class EffortCollectItem extends Factor<number> {
    itemName: string
    count: number
    constructor(itemName: string, count: number = 1) {
        super()
        this.itemName = itemName
        this.count = count
    }

    calculate(botState: BotState): number {
        const entities = Object.values(botState.bot.entities);
        const items = entities.filter(entity => entity.type === 'other' && entity.entityType === 55 && (entity.metadata[1] as {itemId: number}).itemId === botState.mcData.itemsByName[this.itemName].id);

        const itemInfo = items.map(entity => ({
            position: entity.position,
            distance: entity.position.distanceTo(botState.bot.entity.position),
            count: (entity.metadata[1] as {count: number}).count
        }))

        // const sumAvailableItems = itemInfo.reduce((acc, info) => acc + info.count, 0)

        // calc effort for each item to get it

        // calc effort to make new drops from blocks or mobs + collect(already nearby)

        // find cheapest combination of efforts

        return 0
    }
}