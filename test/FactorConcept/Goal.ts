import Action from "./Action";
import BotState from "./Botstate";

//maybe just use lambda functions instead to also include weighting etc.
export default interface Goal {
    fullfillementLevel(botState: BotState): [number, Action[]] //0-1 
    // -> maybe not 0-1 because often there is no limit on one side (e.g. effort can be from infinite to 0)
    // would require proper weighting of goals
}