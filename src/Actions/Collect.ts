import { Bot } from "mineflayer";
import Action from "../Action";
import { Entity } from 'prismarine-entity'
import Target from "../Target";

export default class Collect implements Action {
  private itemName: string;

  constructor(
    itemName: string
  ) {
    this.itemName = itemName;
  }

  getMissingDependencies(_: Bot): Target[] {
    return [];
  }

  startAction(bot: Bot): void {
    const listener = (collector: Entity, collected: Entity) => {
      if (collector !== bot.entity) return;
      if (collected.name !== 'item') return;

      var itemId = (collected.metadata[8] as any).itemId;
      var itemName = getItemNameById(bot, itemId);

      if (itemName !== this.itemName) return;

      bot.removeListener('playerCollect', listener);
      this.stopped = true;
    }
    bot.on('playerCollect', listener);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  abortAction(bot: Bot): void {
    this.inProgress = false;
    bot.chat(`Canceled collecting ${this.itemName}`);
  }

  getEffort(bot: Bot): number {
    return 10000;
  }
}