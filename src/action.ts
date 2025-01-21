import mineflayer from "mineflayer"

export default abstract class Action {
    id: string
    
    constructor(id: string) {
        this.id = id
    }

    //to determine if actions are the same action

    // Executes the action
    abstract run(bot: mineflayer.Bot): void;

    // Determines if the action can be executed
    abstract canRun(bot: mineflayer.Bot): boolean;

    // Returns the effort required to execute this action in ticks
    abstract getEffort(bot: mineflayer.Bot): number;

    // Simulates the action's effect without actually executing it
    abstract simulate(bot: mineflayer.Bot): void;

    // Resets the bot's state after simulation
    abstract resetSimulation(bot: mineflayer.Bot): void;

    // Stops the action if it's running
    abstract stop(bot: mineflayer.Bot): void 

}

// Maybe make simulation only for 1 tick -> 
// no effort calculation
// considers state during actions
// still able to do longer actions