## Concept

abstract class Action // represent a fundemental action which can be started and finishes at some time
    bot: bot
    status: initialized, running, aborted, finished, failed

    init(bot, someproperties)
    start() -> maybe return finishCallback
    isfinished()
    abort()
    getStatus()

//ActionImplementations
class MineBlock
    implementations of functions


class Bot:
    //some Actions single instance cannot be changed (maybe log
    mineBlock: mineblock = new MineBlockAction )
    GoToPosition = new GoToPosition

    //somehow make sure that only one action of a type is run at a time

    Goals: list[Goal]
  
  !!def evaluateGoalTorun(){
    get all currently possible actions
  }



class Goal:
    bot: bot
    subGoals: list[tuple(Goal,Priority: int)] //requirements before 
    effort: int

    init(bot, someproperties)
    getEffort()
    start() {
        if subgoals not finished:
            run subgoals //maybe make que for fundemental tasks which need tobe executed once at a time
        else
            execute self
    }
    isfinished()
    abort()
    getStatus()

