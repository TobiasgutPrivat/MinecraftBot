import mineflayer from "mineflayer";

import {pathfinder} from "mineflayer-pathfinder";
import {Movements, goals} from "mineflayer-pathfinder";
const {GoalFollow} = goals

// import yaml from "js-yaml";

// const settings = yaml.load(require('fs').readFileSync('./settings.yml', 'utf8'));

export default class Bot {
    constructor(name: string) {
        const bot = mineflayer.createBot({
            username: name
        });

        bot.loadPlugin(pathfinder);

        bot.once('spawn', () => {
            bot.chat("Hello World")
            const defaultMove = new Movements(bot)

            bot.on('chat', (username, message) => {
                if (username === bot.username) return
                if (message !== 'come') return
                const target = bot.players[username]?.entity
                if (!target) {
                    bot.chat("I don't see you !")
                return
                }

                bot.pathfinder.setMovements(defaultMove)
                bot.pathfinder.setGoal(new GoalFollow(target, 1))
            });

            // bot.on('kicked', (username, reason) => {
            //     bot.()
            //     bot.chat(`Kicked by ${username} for ${reason}`)
            // })
        })
    }
}