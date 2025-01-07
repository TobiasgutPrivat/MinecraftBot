import mineflayer from "mineflayer";
import {Action,SayMessage} from "./action";

export abstract class Requirement {
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

export class HasSaidMessage extends Requirement {
    constructor(bot: mineflayer.Bot, message: string) {
        super(bot)
        this.actions = [new SayMessage(bot, message)]
    }

    isSatisfied(): boolean {
        //check if steve has said hello
        return this.actions[0].isCompleted()
    }
}