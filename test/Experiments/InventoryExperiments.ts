import mineflayer from "mineflayer";

export function testInventoryModification() {
    const bot = mineflayer.createBot({username: "someBot"});
    bot.once('spawn', async () => {
        //needs to be spawned in before able to read inventory
        const inventorySlots = bot.inventory.slots // slots are null if empty, first 9 not normal slots, slot (9 -> 44): 36 normal, last empty
        
        // inventorySlots.forEach(slot => console.log(slot))
    
        if (inventorySlots[9]){ // assuming slot 9 has item
            inventorySlots[9].stackSize = 33
        }
        console.log(bot.inventory.slots[9]?.stackSize) //can be modified
        await bot.waitForTicks(20)
        console.log(bot.inventory.slots[9]?.stackSize) //still the modified value
        //only reset if inventory changes

    })
}

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