import mineflayer from "mineflayer";

export function BlockLootTest() {
    const bot = mineflayer.createBot({username: "someBot"});
    bot.once('spawn', async () => {
        await bot.waitForTicks(1);
        console.log(bot.registry.blockLoot)
    })
}