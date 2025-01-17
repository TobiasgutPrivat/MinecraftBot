import mineflayer from "mineflayer";
import Requirement from "./requirement";
import MinecraftData from 'minecraft-data'

export default abstract class Action {
    protected mcData = MinecraftData('1.20.4')//TODO: get version somehow (bot.version)
    protected status: 'initialized' | 'running' | 'aborted' | 'finished' | 'failed' = 'initialized'
    private failReason: string | undefined
    protected requirements: Requirement[]

    constructor(requirements: Requirement[]) {
        this.requirements = requirements
    }

    abstract run(bot: mineflayer.Bot): void;
    
    protected abstract stopAction(bot: mineflayer.Bot): void;

    public isRunnable(bot: mineflayer.Bot): boolean {
        return this.requirements.every((req) => req.isSatisfied(bot))
    };

    public getRequiredActions(bot: mineflayer.Bot): Action[] {
        return this.requirements
            .filter((req) => !req.isSatisfied(bot))
            .flatMap((req) => req.getRequiredActions(bot));
    }

    public cancel(bot: mineflayer.Bot): void {
        this.stopAction(bot)
        this.status = "aborted"
    }

    public setFailed(reason: string): void {
        this.failReason = reason
        this.status = "failed"
    }

    public isActive(): boolean {
        return this.status === "running"
    }
}