import Bot from "./Bot";
import { Vec3 } from "vec3";
import BotState from "./Botstate";

const steve = new Bot("steve");
steve.goals.push([1,(botState: BotState) => {
    return 1/botState.bot.entity.position.distanceTo(new Vec3(0,0,0))
}]);