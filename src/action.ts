import mineflayer from "mineflayer";
import { Requirement } from "./requirement";

export abstract class Action {
    requirements: Requirement[]

    constructor(requirements?: Requirement[]) {
        this.requirements = requirements || []
    }

    isRunnable(bot: mineflayer.Bot): boolean {
        return this.requirements.every((req) => req.isSatisfied(bot))
    };

    getRequiredActions(bot: mineflayer.Bot): Action[] {
        return this.requirements
            .filter((req) => !req.isSatisfied(bot))
            .flatMap((req) => req.getRequiredActions(bot));
    }

    abstract run(bot: mineflayer.Bot, finishcallback?: () => void): void;
    abstract cancel(bot: mineflayer.Bot): void;
    abstract isActive(bot: mineflayer.Bot): boolean;
    abstract isCompleted(bot: mineflayer.Bot): boolean;
}

export class SayMessage extends Action {
    completed: boolean = false
    message: string
    constructor(message: string) {
        super()
        this.message = message
    }

    run(bot: mineflayer.Bot, finishcallback?: () => void) {
        bot.chat(this.message)
        this.completed = true
        finishcallback?.()
    }
    cancel(bot: mineflayer.Bot): void {

    }
    isActive(bot: mineflayer.Bot): boolean {
        return false
    }
    isCompleted(bot: mineflayer.Bot): boolean {
        return this.completed;
    }
}