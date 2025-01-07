import Bot from "./bot";

export default interface Action {
    Bot : Bot
    run(finishcallback: () => void) : void;// , failcallback: () => void
    cancel() : void;
    // isFailed() : void;
    isActive() : boolean;
    isCompleted() : boolean;
}