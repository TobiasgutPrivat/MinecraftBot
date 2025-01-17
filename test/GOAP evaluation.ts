import mineflayer from 'mineflayer';

export abstract class Task {
    preconditions: Condition[]; // Requirements that must be satisfied
    effects: Condition[]; // Changes made by completing this task
    cost: number; // Cost or priority of the task

    constructor(preconditions?: Condition[], effects?: Condition[], cost?: number) {
        this.preconditions = preconditions || [];
        this.effects = effects || [];
        this.cost = cost || 0;
    }

    canRun(bot: mineflayer.Bot): boolean{
        return this.preconditions.every(condition => condition.isSatisfied(bot));
    }; 

    abstract run(bot: mineflayer.Bot): void; // Execute the task
}

export interface Condition {
    isSatisfied(bot: mineflayer.Bot): boolean; // Check if the condition is met
}

export class HasItem implements Condition {
    private item: string;    // The item that needs to be checked
    private quantity: number; // The quantity required of the item

    constructor(item: string, quantity: number = 1) {
        this.item = item;
        this.quantity = quantity;
    }

    // Check if the bot has the required quantity of the item
    isSatisfied(bot: mineflayer.Bot): boolean {
        return (bot.inventory.findInventoryItem(1,null,false)?.stackSize || 0) >= this.quantity; //TODO get item id
    }
}

export class nearBlock implements Condition {
    private block: string;
    private distance: number;

    constructor(block: string, distance: number) {
        this.block = block;
        this.distance = distance;
    }

    isSatisfied(bot: mineflayer.Bot): boolean {
        return bot.findBlock({
            maxDistance: this.distance,
            matching: (block) => block.name === this.block
        }) ? true : false
    }
}

export class MineBlock extends Task {
    private block: string;

    constructor(block: string) {
        //depending on block drops
        super([new nearBlock(block, 5)], [new HasItem(block)], 3);
        this.block = block;
    }

    run(bot: mineflayer.Bot): void {
        //TODO: Mine the block       
    }
}

export class CraftBlock extends Task {
    private block: string;

    constructor(bot: mineflayer.Bot, block: string) {
        // const recipe = bot.recipesFor(); //TODO: get required items from recipe
        super([new HasItem(block)], [new HasItem(block)], 1); //use recipe
        this.block = block;
    }

    run(bot: mineflayer.Bot): void {
        //TODO: Craft the block
    }
}

class Evaluation {
    public static evaluate(task: Task, bot: mineflayer.Bot): void {
        // GOAP is designed to complete all goals in shortest path
        // not sure how to make it more dynamic to consider value of goals

        // 1. determine goal state of the bot

        // 2. iteratively generate relevant tasks and conditions, based on goal state

        // 3. find lowest cost Path (GOAP)
        
    }
}