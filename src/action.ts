import mineflayer from "mineflayer";
import Requirement from "./requirement";

export default abstract class Action {
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