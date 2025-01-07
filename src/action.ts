import mineflayer from "mineflayer";

export abstract class Action {
    actions: Action[]

    constructor(action?: Action[]) {
        this.actions = action ? action : []
    }

    isRunnable(bot: mineflayer.Bot): boolean {
        return this.actions.every((req) => req.isCompleted(bot))
    };

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