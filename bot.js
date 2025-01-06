"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mineflayer_1 = __importDefault(require("mineflayer"));
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const mineflayer_pathfinder_2 = require("mineflayer-pathfinder");
const { GoalFollow } = mineflayer_pathfinder_2.goals;
// import yaml from "js-yaml";
// const settings = yaml.load(require('fs').readFileSync('./settings.yml', 'utf8'));
class Bot {
    constructor(name) {
        const bot = mineflayer_1.default.createBot({
            username: name
        });
        bot.loadPlugin(mineflayer_pathfinder_1.pathfinder);
        bot.once('spawn', () => {
            bot.chat("Hello World");
            const defaultMove = new mineflayer_pathfinder_2.Movements(bot);
            bot.on('chat', (username, message) => {
                var _a;
                if (username === bot.username)
                    return;
                if (message !== 'come')
                    return;
                const target = (_a = bot.players[username]) === null || _a === void 0 ? void 0 : _a.entity;
                if (!target) {
                    bot.chat("I don't see you !");
                    return;
                }
                bot.pathfinder.setMovements(defaultMove);
                bot.pathfinder.setGoal(new GoalFollow(target, 1));
            });
            // bot.on('kicked', (username, reason) => {
            //     bot.()
            //     bot.chat(`Kicked by ${username} for ${reason}`)
            // })
        });
    }
}
exports.default = Bot;
