// import BotState from "../Botstate";
// import Factor from "../Factor";
// import { Item } from "minecraft-data";
// import EffortItem from "./EffortItem";

// export default class ObtainableTools extends Factor<{tool: Item, effort: number, power: number}[]> {
//     type: string
//     constructor(type: string) {
//         super()
//         this.type = type
//     }

//     calculate(botState: BotState): {tool: Item, effort: number, power: number}[] {
//         // const types = ["pickaxe", "shovel", "axe", "hoe"]
//         const levels = ["wooden","stone", "iron", "gold", "diamond", "netherite"]

//         const items: Item[] = levels.map(level => botState.bot.registry.itemsByName[level + "_" + this.type]);

//         const obtainableTools = items.map(item => { return {
//             tool: item, 
//             effort: new EffortItem(item.name).get(botState),
//             power: levels.indexOf(item.name.split("_")[0]) // TODO: get actual value
//         }});

//         return obtainableTools
//     }
// }