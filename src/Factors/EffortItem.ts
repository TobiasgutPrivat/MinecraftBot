import { BlockList } from "net"
import BotState from "../Botstate"
import Factor from "../Factor"
import CollectableItems from "./CollectableItems"
import ItemCost from "./ItemCost"
import MineableBlocks from "./MineableBlocks"
import {Item} from "minecraft-data"

export default class EffortItem extends Factor<number> {
    itemName: string
    count: number
    constructor(itemName: string, count: number = 1) {
        super()
        this.itemName = itemName
        this.count = count
    }

    calculate(botState: BotState): number {
        const inventoryCount: number = botState.bot.inventory.count(botState.bot.registry.itemsByName[this.itemName].id, null);
        const remainingCount = this.count - inventoryCount

        const itemCost = new ItemCost(this.itemName).get(botState)
        
        const claimCost = inventoryCount * itemCost //maybe include in ObtainWays

        if (remainingCount <= 0) return claimCost // using from Inventory has some cost

        // Ways to get Items
        var obtainWays: {effort: number, count: number}[] = [] // maybe make class for {effort: number, count: number}

        obtainWays.push(...new CollectableItems(this.itemName).get(botState))
        // +
        const blockTypesToMine = this.blockTypesToMine(botState, this.itemName)
        for (const block of blockTypesToMine) {
            obtainWays.push(...new MineableBlocks(block, remainingCount).get(botState))
        }
        // +
        // mineBlock
        // +
        // killMob
        // +
        // effortLootItem

        // evaluate all possibilities (craft, collect, mine, kill -> array of [effort, count]) and choose best combination
        const totalEffort = this.EffortFromObtainWays(obtainWays, remainingCount)

        // No direct influence from Actions

        return claimCost + totalEffort
    }

    private blockTypesToMine(botState: BotState, itemName: string): string[] { //Maybe Export to lib
        const blocksToMine: string[] = []
        for (const block of Object.values(botState.bot.registry.blockLoot)) {
            const blockDrops = block.drops.map(drop => drop.item)
            if (blockDrops.includes(itemName)) {
                blocksToMine.push(block.block)
            }
        }
        return blocksToMine
    }

    private EffortFromObtainWays(obtainWays: {effort: number, count: number}[], requiredCount: number): number { //Maybe Export
        // Calculate efficiency (effort per item) and sort options by it
        obtainWays.sort((a, b) => (a.effort / a.count) - (b.effort / b.count));
        
        let totalEffort = 0;
        let itemsCollected = 0;

        for (const obtainWay of obtainWays) {
            const { effort, count } = obtainWay;
                // Take all items from this option
                totalEffort += effort; // Use full effort for this option
                itemsCollected += count;
            if (itemsCollected + count >= requiredCount) {
                break;
            }
        }

        // If not enough items are available
        if (itemsCollected < requiredCount) {
            // console.log(`Not enough ${this.itemName} collectable. Required: ${requiredCount}, Collected: ${itemsCollected}`);
        }

        // const additionalItems: number = (itemsCollected - requiredCount) // maybe calc in items which are left

        return totalEffort;
    }
}