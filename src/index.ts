import Bot from "./Bot";
import { Vec3 } from "vec3";
import BotState from "./Botstate";
import EffortGetToPos from "./Factors/EffortGetToPos";
import EffortHaveItem from "./Factors/EffortHaveItem";

const steve = new Bot("steve");
steve.goals.push([1, (botState: BotState) => {
    return - new EffortHaveItem("dirt", 4).get(botState);
}]);