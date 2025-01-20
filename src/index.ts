import Bot from "./Bot";
import BotState from "./Botstate";
import EffortItem from "./Factors/EffortItem";

const steve = new Bot("steve");
steve.goals.push([1, (botState: BotState) => {
    return - new EffortItem("cobblestone", 4).get(botState);
}]);