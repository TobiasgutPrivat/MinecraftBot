import Requirement from "../requirement";
import mineflayer from "mineflayer";

export default class NearBlock extends Requirement {
    block: string;
    distance: number;
    constructor(block: string, distance: number) {
        super([]); //Actions: goToBlock
        this.block = block;
        this.distance = distance;
    }

    isSatisfied(bot: mineflayer.Bot): boolean {
        return bot.findBlock({ matching: (block) => block.name === this.block, maxDistance: this.distance }) ? true : false;
    }
}