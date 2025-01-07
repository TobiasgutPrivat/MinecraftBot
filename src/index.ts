import mineflayer from "mineflayer"
import Action from "./action"
import Bot from "./bot"
import Requirement from "./requirement"

class SayMessage extends Action {
    completed : boolean = false
    message : string
    constructor(bot: mineflayer.Bot, message: string) {
        super(bot)
        this.message = message
    }

    run(finishcallback?: () => void) {
        this.bot.chat(this.message)
        finishcallback?.()
        this.completed = true
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

class HasSaidMessage extends Requirement {
    constructor(bot: mineflayer.Bot, message: string) {
        super(bot)
        this.actions = [new SayMessage(bot, message)]
    }

    isSatisfied(): boolean {
        //check if steve has said hello
        return this.actions[0].isCompleted()
    }
}

const steve = new Bot("Steve")
steve.addGoal(new HasSaidMessage(steve.bot, "Hello from Steve"))
steve.addGoal(new HasSaidMessage(steve.bot, "Again Hello from Steve"))
const alex = new Bot("Alex")
alex.addGoal(new HasSaidMessage(steve.bot, "Hello from Alex"))
