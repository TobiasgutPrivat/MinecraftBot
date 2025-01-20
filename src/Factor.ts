import Action from "./Action";
import BotState from "./Botstate";

export default abstract class Factor<T = unknown> {
    botState: BotState | undefined

    //to determine if factors are the same (for caching)
    get id(): string {  
        const attributes = JSON.stringify(this);
        return `${this.constructor.name}:${attributes}`;
    }

    // suggest an action for current botState
    // only for use in Factor implementations
    protected suggestAction(action: Action) {
        if (this.botState){
            this.botState.actionSuggestions.push(action)
        }  else {
            throw new Error("botState is undefined")
        }
    }

    // external getter for factors
    get(bot: BotState): T {
        this.botState = bot

        if (bot.cache.has(this.id)) {
          return bot.cache.get(this.id) as T; // return the cached result if it exists
        }

        const result = this.calculate(bot); // calculate the result if it's not cached
        bot.cache.set(this.id, result); // store the result in the cache

        this.botState = undefined
        return result;
    }

    // implementation of actual calculation
    abstract calculate(botState: BotState): T
}

//Best Practice:

// for progress Goals: Fullfillement = -Effort

// Effort evaluation:
// for Actions Effort requirements + effort execution
// on multiple options choose lower effort one -> Actions improveing worse option don't effect Effort -> faster one will be chosen

// chance of succes like drop rates just include in effort (effort/chance of success, maybe * riskwillingness)

// chance of loosing to death -> idk how to handle that

// Still need some best Practice for time management -> shortterm, longterm effects

