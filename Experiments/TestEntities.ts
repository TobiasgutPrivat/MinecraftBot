import mineflayer from "mineflayer";

export function entityTest() {
    const bot = mineflayer.createBot({username: "someBot"});
    bot.once('spawn', async () => {
        await bot.waitForTicks(1);
        const entities = Object.values(bot.entities);
        entities.forEach(entity => console.log(entity));
    })
}