import { SayMessage } from "./action"
import Bot from "./bot"

const steve = new Bot("Steve")
steve.addGoal(new SayMessage("Hello from Steve"))
steve.addGoal(new SayMessage("Again Hello from Steve"))
const alex = new Bot("Alex")
alex.addGoal(new SayMessage("Hello from Alex"))
