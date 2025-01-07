import Bot from "./bot"
import {HasSaidMessage} from "./requirement"

const steve = new Bot("Steve")
steve.addGoal(new HasSaidMessage(steve.bot, "Hello from Steve"))
steve.addGoal(new HasSaidMessage(steve.bot, "Again Hello from Steve"))
const alex = new Bot("Alex")
alex.addGoal(new HasSaidMessage(steve.bot, "Hello from Alex"))
