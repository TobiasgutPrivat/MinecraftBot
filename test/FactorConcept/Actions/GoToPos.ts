import Action from "../Action";
import { Vec3 } from "vec3";
import mineflayer from "mineflayer";
import { goals } from "mineflayer-pathfinder";

const GoalNear = goals.GoalNear

//generally not optimal Action because pathfinder doesn't consider other factors into path planning
export default class GoToPos implements Action {
    id: string
    stopped: boolean = false
    pos: Vec3
    proximity: number
    constructor(pos: Vec3, proximity: number) {
        this.id = "GoToPos" + pos.toString()
        this.pos = pos
        this.proximity = proximity
    }

    canRun(bot: mineflayer.Bot): boolean {
        return true
        //TODO: check if bot can reach pos
    }

    run(bot: mineflayer.Bot): void {
        bot.chat("Running GoToPos" + this.pos.toString())
        bot.pathfinder.setGoal(new GoalNear(this.pos.x, this.pos.y, this.pos.z, this.proximity));
    }

    stop(bot: mineflayer.Bot): void {
        bot.pathfinder.setGoal(null)
        this.stopped = true
    }

    getEffort(bot: mineflayer.Bot): number {
        return bot.entity.position.distanceTo(this.pos) / bot.physics.sprintSpeed * 20 
        // TODO: make this more accurate
    }

    simulateBotState(bot: mineflayer.Bot): void {
        bot.entity.position = this.pos
    }
}   