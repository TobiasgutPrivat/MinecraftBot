import { Bot } from "mineflayer";
import Craft from "../Actions/Craft";
import Action from "../Action";
import { Recipe } from "prismarine-recipe";
import Target from "../Target";

export default class OwnTool extends Target {
  private tools: string[];

  constructor(tools: string[]) {
    super();
    this.tools = tools;
  }

  isCompleted(bot: Bot): boolean {
    for (const tool of this.tools) {
      if (bot.inventory.count(tool, null) > 0) return true;
    }
    return false;
  }

  getActions(bot: Bot): Action[] {
    const actions: Action[] = [];

    const recipes: Recipe[] = [];

    for (const tool of this.tools) {
      bot.recipesAll(bot.registry.itemsByName[tool].id, null, true)
    }

    // clear duplicat recipes
    recipes.forEach(recipe => {
      actions.push(new Craft(recipe));
    });

    return actions;
  }
}