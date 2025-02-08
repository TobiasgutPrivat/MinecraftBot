import mineflayer from "mineflayer"
import Bot from "./Bot"
import Target from "./Target"

export default abstract class Action {
    //to determine if actions are the same action
    id: string
    stopped = false
    
    constructor(id: string) {
        this.id = id
    }

    // Executes the action
    abstract run(bot: mineflayer.Bot): void;

    // Determines if the action can be executed
    abstract canRun(bot: mineflayer.Bot): boolean;

    // Requirements to run this action
    abstract getRequirements(bot: Bot): Target[];

    // Returns the effort required to execute this action later
    abstract getEffortFuture(bot: Bot): number;

    // Returns the effort required to execute this action currently
    abstract getEffortNow(bot: mineflayer.Bot): number;

    // Stops the action if it's running
    protected abstract abortAction(bot: mineflayer.Bot): void 

    stop(bot: mineflayer.Bot): void {
        this.abortAction(bot)
        this.stopped = true
    }
}