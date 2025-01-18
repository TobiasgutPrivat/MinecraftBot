import mineflayer from "mineflayer";

export interface Task {
    tasks: Task[]; //repressents ways to satisfy the requirement
    isSatisfied(bot: mineflayer.Bot): boolean;
    canRun(bot: mineflayer.Bot): boolean; // true if all requirements are satisfied
    run(bot: mineflayer.Bot, finishcallback?: () => void): void; // Execute the task.
}

// Task haveStonepickaxe:
// isSatisfied: check if the player has a pickaxe
// -> if not craft pickaxe
// tasks: haveStone, havesticks, haveplacedcraftingtable
// run: craft

// Task haveStone:
// isSatisfied: check if the player has a stone
// -> if not mine stone
// tasks: havepickaxe
// run: mine

// Task haveSticks:
// isSatisfied: check if the player has a sticks
// -> if not mine leaves || craft sticks //TODO how to represent multiple ways
// tasks: None || haveWoodenPlanks 
// run: mine || craft

export interface Requirement {
    actions: Action[]; //repressents ways to satisfy the requirement
    isSatisfied(bot: mineflayer.Bot): boolean;
}

export interface Action {
    requirements: Requirement[]
    canRun(bot: mineflayer.Bot): boolean; // true if all requirements are satisfied
    run(bot: mineflayer.Bot, finishcallback?: () => void): void;
}

// Requirement haveStonepickaxe:
// isSatisfied: check if the player has a pickaxe
// actions: [craftStonepickaxe]

// Action craftpickaxe:
// requirements: [haveStone, haveSticks, haveplacedcraftingtable]
// run: craft

// Requirement haveStone:
// isSatisfied: check if the player has a stone
// actions: [minestone]

// Action minestone:
// requirements: [havepickaxe]
// run: mine

// Requirement haveSticks:
// isSatisfied: check if the player has a sticks
// actions: [mineleaves, craftsticks]

// Action mineleaves:
// requirements: []
// run: mine

// Action craftsticks:
// requirements: [haveWoodenPlanks]
// run: craft

export interface Task {
    preconditions: Condition[]; // Requirements that must be satisfied
    effects: Condition[]; // Changes made by completing this task
    cost: number; // Cost or priority of the task
    canRun(bot: mineflayer.Bot): boolean; // Check if the task is actionable -> if all preconditions are met
    run(bot: mineflayer.Bot, finishCallback?: () => void): void; // Execute the task
}

export interface Condition {
    isSatisfied(bot: mineflayer.Bot): boolean; // Check if the condition is met
}

// Task craftStonepickaxe:
// preconditions: [haveStone, haveSticks, haveplacedcraftingtable]
// effects: [haveStonepickaxe]
// cost: 1
// run: craft

// Condition have*:
// isSatisfied: check if the player has specific item

// Task mineStone:
// preconditions: [havepickaxe]
// effects: [haveStone]
// cost: 5
// run: mine

// Task mineLeaves:
// preconditions: []
// effects: [haveSticks]
// cost: 3
// run: mine

// Task craftSticks:
// preconditions: [haveWoodenPlanks]
// effects: [haveSticks]
// cost: 1
// run: craft