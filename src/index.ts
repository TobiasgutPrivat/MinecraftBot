import Bot from "../test/FactorConcept/Bot";
import { Vec3 } from "vec3";
import GoalNearPos from "../test/FactorConcept/Goals/GoalNearPos";

const steve = new Bot("steve");
steve.goals.push([1,new GoalNearPos(new Vec3(332, 125, -157))]);