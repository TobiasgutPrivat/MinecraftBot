import mineflayer from "mineflayer";
import {Requirement} from "./requirement";

export abstract class Action {
    bot : mineflayer.Bot
    requirements : Requirement[]

    constructor(bot: mineflayer.Bot, requirements?: Requirement[]) {
        this.bot = bot
        this.requirements = requirements ? requirements : []
    }

    isRunnable() : boolean {
        return this.requirements.every((req) => req.isSatisfied())    
    };

    getRequiredActions(): Action[] {
        return this.requirements
            .filter((req) => !req.isSatisfied())
            .flatMap((req) => req.getRequiredActions());
    }

    abstract run(finishcallback?: () => void) : void;
    abstract cancel() : void;
    abstract isActive() : boolean;
    abstract isCompleted() : boolean;
}

export class SayMessage extends Action {
    completed : boolean = false
    message : string
    constructor(bot: mineflayer.Bot, message: string) {
        super(bot)
        this.message = message
    }

    run(finishcallback?: () => void) {
        this.bot.chat(this.message)
        this.completed = true
        finishcallback?.()
    }
    cancel(): void {
        
    }
    isActive(): boolean {
        return false
    }
    isCompleted(): boolean {
        return this.completed;
    }
}