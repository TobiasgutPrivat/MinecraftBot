import Bot from "./Bot";
import { Vec3 } from "vec3";
import BotState from "./Botstate";
import EffortGetToPos from "./Factors/EffortGetToPos";

const steve = new Bot("steve");
steve.goals.push([1, (botState: BotState) => {
    return - botState.calc(new EffortGetToPos(new Vec3(0,0,0), 1));
}]);