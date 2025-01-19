import BotState from "../Botstate";
import EffortHaveItem from "./EffortHaveItem";

export default function RobinChallengeGoal(botState: BotState): number {
    const effortCobbleStone: number = botState.calc(new EffortHaveItem('cobblestone', 1));
    const effortSandstoneSlab: number = botState.calc(new EffortHaveItem('sandstone_slab', 8));
    const effortOrangeDye: number = botState.calc(new EffortHaveItem('orange_dye', 1));

    const order = effortCobbleStone < effortSandstoneSlab ? [effortCobbleStone, effortSandstoneSlab, effortOrangeDye] : [effortSandstoneSlab, effortCobbleStone, effortOrangeDye];

    return - (order[0] * 1 + order[1] * 2 + order[2] * 3);
}