import mineflayer from "mineflayer"


export default interface Action {
    id: string //to determine if actions are the same action
    stopped: boolean

    run(bot: mineflayer.Bot): void
    canRun(bot: mineflayer.Bot): boolean
    getEffort(bot: mineflayer.Bot): number //only Effort for running this Action, in ticks, used to determine Utility/Effort
    simulateBotState(bot: mineflayer.Bot): void

    stop(bot: mineflayer.Bot): void

}

//Maybe make Action only run for 1 tick -> no effort calculation, no need for canceling
//would allow for more precise states after actions
//would require handling more factors (also things like momentum, cause effecting effectiveness of next movement)
// + Effects like regeneration, Weapon recharge etc.
// would not allow to use pathfinder, but pathfinder could be used to suggest Action for Movement