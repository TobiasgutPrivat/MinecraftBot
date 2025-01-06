import Bot from "./bot";

interface Requirement {
    Bot : Bot
    isSatisfied() : boolean;
    getPossibleActions() : Action[];
}

interface Action {
    Bot : Bot
    run(finishcallback: () => void) : void;// , failcallback: () => void
    cancel() : void;
    // isFailed() : void;
    isActive() : boolean;
    isCompleted() : boolean;
}