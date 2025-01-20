import BotState from "../Botstate"
import { Vec3 } from "vec3"
import Factor from "../Factor"
import GoToPos from "../Actions/GoToPos";

export default class EffortGetToPos extends Factor<number> {
    position: Vec3
    proximity: number

    constructor(position: Vec3, proximity: number) {
        super(); 
        this.position = position 
        this.proximity = proximity
    }

    calculate(botState: BotState): number {
        const distance = botState.bot.entity.position.distanceTo(this.position)
        if (distance < this.proximity) return 0
        botState.actionSuggestions.push(new GoToPos(this.position, this.proximity))
        return distance / botState.bot.physics.sprintSpeed * 20 // in ticks
    }
}