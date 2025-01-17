import mineflayer from "mineflayer";
import { pathfinder, Movements } from "mineflayer-pathfinder";
import Action from "./Action";
import Goal from "./Goal";

export default class Bot {
    private currentaction?: Action
    bot: mineflayer.Bot
    goals: Goal[] 

    constructor(name: string) {
        this.bot = mineflayer.createBot({
            username: name
            // default settings
            // host: "127.0.0.1",
            // port: 25565,
            // auth: 'offline',
        });

        this.bot.loadPlugin(pathfinder); // enable pathfinder plugin
        this.bot.pathfinder.setMovements(new Movements(this.bot));

        this.bot.once('spawn', () => {
            // not functional
            this.bot.chat("Hello World")
        })

        this.bot.on('physicTick', () => {
            // Designed to reevaluate every tick
            // alternative: reevaluate on specific triggers (like chat, death, completion, failure)
            this.ReEvaluateActions()
        })

        this.bot.on('kicked', () => {
            this.bot.connect({ username: name })
        })

        this.goals = []
    }

    private ReEvaluateActions() {
        
    }
}