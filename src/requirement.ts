import mineflayer from "mineflayer";
import Action from "./action";

export default abstract class Requirement {
    bot : mineflayer.Bot
    actions : Action[]; //repressents ways to satisfy the requirement

    constructor(bot: mineflayer.Bot, actions?: Action[]) {
        this.bot = bot 
        this.actions = actions ? actions : []
    }

    abstract isSatisfied() : boolean;

    getRequiredActions(): Action[] {
        const runnableActions: Action[] = [];

        for (const action of this.actions) {
            //returns all options -> TODO evaluate which is best
            if (action.isRunnable()) {
                //if action is runnable no need to check actions for requirements
                runnableActions.push(action);
            } else {
                //if action is not runnable, get actions to satisfy requirements
                runnableActions.push(...action.getRequiredActions());
            }
        }

        return runnableActions;
    }
}