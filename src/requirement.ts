import mineflayer from "mineflayer";
import { Action, SayMessage } from "./action";

export abstract class Requirement {
    actions: Action[]; //repressents ways to satisfy the requirement

    constructor(actions?: Action[]) {
        this.actions = actions ? actions : []
    }

    abstract isSatisfied(bot: mineflayer.Bot): boolean;

    getRequiredActions(bot: mineflayer.Bot): Action[] {
        const runnableActions: Action[] = [];

        for (const action of this.actions) {
            //returns all options -> TODO evaluate which is best
            if (action.isRunnable(bot)) {
                //if action is runnable no need to check actions for requirements
                runnableActions.push(action);
            } else {
                //if action is not runnable, get actions to satisfy requirements
                runnableActions.push(...action.getRequiredActions(bot));
            }
        }

        return runnableActions;
    }
}

export class HasSaidMessage extends Requirement {
    constructor(message: string) {
        super()
        this.actions = [new SayMessage(message)]
    }

    isSatisfied(bot: mineflayer.Bot): boolean {
        //check if steve has said hello
        return this.actions[0].isCompleted(bot)
    }
}