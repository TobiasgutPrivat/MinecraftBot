import mineflayer from "mineflayer";
import _ from 'lodash';

export function testInventoryModification() {
    const bot = mineflayer.createBot({username: "someBot"});
    bot.once('spawn', async () => {
        //needs to be spawned in before able to read inventory
        const inventorySlots = bot.inventory.slots // slots are null if empty, first 9 not normal slots, slot (9 -> 44): 36 normal, last empty
        
        // inventorySlots.forEach(slot => console.log(slot))
    
        if (inventorySlots[9]){ // assuming slot 9 has item
            inventorySlots[9].stackSize = 33 
        }
        console.log(bot.inventory.slots[9]?.stackSize) // -> 33
        await bot.waitForTicks(1)
        console.log(bot.inventory.slots[9]?.stackSize) // -> 33
        //only resets if inventory is changed

        // const ClonedBot: mineflayer.Bot = JSON.parse(JSON.stringify(bot))
        const ClonedBot: mineflayer.Bot = _.cloneDeep(bot); // creates a cloned version with same data but different reference
        console.log(ClonedBot.inventory.slots[9]?.stackSize) // -> 33
        if (ClonedBot.inventory.slots[9]){ // assuming slot 9 has item
            ClonedBot.inventory.slots[9].stackSize = 64 
        }

        console.log(ClonedBot.inventory.slots[9]?.stackSize) // -> 64
        console.log(bot.inventory.slots[9]?.stackSize) // -> 33
    })
}