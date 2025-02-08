import { Bot } from "mineflayer";
import Craft from "../Actions/Craft";
import Action from "../Action";
import OwnItem from "./OwnItem";
import { Recipe } from "prismarine-recipe";

export default class OwnTool extends OwnItem {
  private tools: string[];

  constructor(tools: string[]) {
    super("");
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