import mineflayer from "mineflayer"

export default interface Action {
    id: string //to determine if actions are the same action
    stopped: boolean

    // Executes the action
    run(bot: mineflayer.Bot): void;

    // Determines if the action can be executed
    canRun(bot: mineflayer.Bot): boolean;

    // Returns the effort required to execute this action in ticks
    getEffort(bot: mineflayer.Bot): number;

    // Simulates the action's effect without actually executing it
    simulate(bot: mineflayer.Bot): void;

    // Resets the bot's state after simulation
    resetSimulation(bot: mineflayer.Bot): void;

    // Stops the action if it's running
    stop(bot: mineflayer.Bot): void;

}

// Maybe make simulation only for 1 tick -> 
// no effort calculation
// considers state during actions
// still able to do longer actions