import { Bot } from "mineflayer";
import Craft from "../Actions/Craft";
import Target from "../Target";
import Action from "../Action";
import { DigBlock } from "../Actions/DigBlock";
import Collect from "../Actions/Collect";

export default class OwnItem implements Target {
  private itemName: string;
  private count: number

  constructor(itemName: string, count: number = 1) {
    this.itemName = itemName;
    this.count = count;
  }

  isCompleted(bot: Bot): boolean {
    return bot.inventory.count(this.itemName, null) >= this.count;
  }

  getActions(bot: Bot): Action[] {
    const actions: Action[] = [];

    const recipes = bot.recipesAll(bot.registry.itemsByName[this.itemName].id, null, true)

    // clear duplicat recipes

    recipes.forEach(recipe => {
      actions.push(new Craft(recipe));
    });

    this.blockTypesToMine(bot, this.itemName).forEach(block => {
      actions.push(new DigBlock(block));
    });

    // actions.push(new Collect(this.itemName));

    return actions;
  }

  private blockTypesToMine(bot: Bot, itemName: string): string[] { //Maybe Export to lib
    const blocksToMine: string[] = []
    for (const block of Object.values(bot.registry.blockLoot)) {
        const blockDrops = block.drops.map(drop => drop.item)
        if (blockDrops.includes(itemName)) {
            blocksToMine.push(block.block)
        }
    }
    return blocksToMine
}
}