import BotState from "../Botstate";
import Factor from "../Factor";
import { Entity } from "prismarine-entity";

export default class ItemDrops extends Factor<Entity[]> {
    itemName: string | undefined;

    constructor(itemName: string | undefined = undefined) {
        super();
        this.itemName = itemName;
    }

    calculate(botState: BotState): Entity[] {
        const entities = Object.values(botState.bot.entities);
        const itemDrops = entities.filter(entity => entity.type === 'other' && entity.entityType === 55)
        if (this.itemName) {
            const itemId = botState.bot.registry.itemsByName[this.itemName as string].id
            return itemDrops.filter(entity => (entity.metadata[8] as {itemId: number}).itemId === itemId);
        } else {
            return itemDrops
        }
    }
}

