import BotState from "../Botstate";
import Goal from "../Goal";
import { Vec3 } from "vec3";
import Action from "../Action";
import GoToPos from "../Actions/GoToPos";

export default class GoalNearPos implements Goal {
    position: Vec3
    constructor(position: Vec3) {
        this.position = position
    }
    fullfillementLevel(botState: BotState): [number, Action[]] {
        return [1/botState.bot.entity.position.distanceTo(this.position), [ new GoToPos(this.position, 1) ]]
    }
}