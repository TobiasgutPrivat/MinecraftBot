import Bot from "./bot";
import Action from "./action";

export default interface Requirement {
    Bot : Bot
    isSatisfied() : boolean;
    getPossibleActions() : Action[];
}