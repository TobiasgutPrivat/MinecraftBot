import mineflayer from "mineflayer";

export interface Task {
    isSatisfied(bot: mineflayer.Bot): boolean; // Whether the task is already complete.
    canRun(bot: mineflayer.Bot): boolean; // Whether the task can be executed immediately.
    getSubtasks(bot: mineflayer.Bot): Task[]; // Subtasks needed before running.
    run(bot: mineflayer.Bot): Promise<void>; // Execute the task.
}

// Task haveStonepickaxe:
// isSatisfied: check if the player has a pickaxe
// -> if not craft pickaxe
// subTasks: haveStone, havesticks, haveplacedcraftingtable
// canRun: haveStone && haveSticks && haveplacedcraftingtable
// run: craft

// Task haveStone:
// isSatisfied: check if the player has a stone
// -> if not mine stone
// subTasks: havepickaxe
// canRun: havepickaxe
// run: mine

// Task haveSticks:
// isSatisfied: check if the player has a sticks
// -> if not mine leaves || craft sticks //TODO how to represent multiple ways
// subTasks: None || haveWoodenPlanks 
// canRun: True || haveWoodenPlanks
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