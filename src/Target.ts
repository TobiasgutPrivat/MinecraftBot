import mineflayer from "mineflayer";
import Action from "./Action";
import Bot from "./Bot";

export default interface Target {
  isCompleted(bot: mineflayer.Bot): boolean;
  //ways to fullfill the target
  getActions(bot: mineflayer.Bot): Action[];
}