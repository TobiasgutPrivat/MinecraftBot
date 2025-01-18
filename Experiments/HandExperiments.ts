import mineflayer from 'mineflayer'

export function equipTest(){
    const bot = mineflayer.createBot({username: "someBot"});
    bot.once('spawn', () => {
        bot.equip(bot.registry.itemsByName.diamond.id, 'hand') //used for managing relevant slots in inventory
    })
}

export function digTimeTest() {
    const bot = mineflayer.createBot({username: "someBot"});
    bot.once('spawn', async () => {
        bot.equip(bot.registry.itemsByName["diamond_pickaxe"].id, 'hand') //digtime depends on equiped tool
        await bot.waitForTicks(1) // needs some time to load in blocks
        const block = bot.findBlock({  matching: bot.registry.blocksByName["stone"].id, maxDistance: 2 })
        bot.chat(block?.displayName ?? "null")
        if (block) {
            bot.chat(bot.digTime(block).toString()) // try out maybe depends on tool in hand
        }
    })
}