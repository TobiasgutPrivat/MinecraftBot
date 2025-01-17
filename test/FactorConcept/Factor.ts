import Action from "./Action";
import BotState from "./Botstate";

export default interface Factor {
    id: string //to determine if factors are the same factor
    effectedBy(action: Action): boolean
    getValue(bot: BotState): any
}

