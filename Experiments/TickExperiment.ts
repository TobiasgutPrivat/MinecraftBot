import mineflayer from "mineflayer";

export default function TickExperiment() {
    const bot = mineflayer.createBot({username: "someBot"});
    bot.once('spawn', async () => {
        //TODO: figure out when inventory is updated
        // at any time if inventory is changed or only on tick
    });
}