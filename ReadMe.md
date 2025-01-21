## Local setup

- Open a minecraft world in `1.21.1`. A list of supported versions by Mineflayer can be found [here](https://github.com/PrismarineJS/mineflayer/blob/master/lib/version.js#L1)
- Open the game to lan with the port `25565`
- Run `npm i`
- Run `npm run start`

## Concept


### implementation guide

**new functionality**
start from wanted goal factor, and implement required factors.

**improvements**
can be done progressifly:
make better Evaluation of current state 
-> do not introduce unlinear stuff (makes some restrictions but concept doesn't make much sense otherwise)

**Modulation**
If some code is used multiple times -> if possible export to Factor

**How to look for improvements**
Observe bot and see what you would do diffrent -> figure out determining Factors

**Decide Factor or Lib**
If mostly data from bot needed -> Factor
If mostly data from mcdata/parameters needed -> Lib


## Decisions
this Algorythm is good for managing uncertainty, and diffrent goals but not for exact planning 
-> making estimations instead of calculations

### Values
**for progress things:**
measure Effort in ticks 
cost in estimated effort to get the item

**for avoidance:**
measure chance,
        
**Examples special cases**
**for progress things:**
taking something away from inventory 
-> not calculated in for other actions requiring these as well 
-> but calculate costs (as effort) of these items based on history (availability, effort, etc.)(maybe like positions from last ticks needs, availability and efforts)

using a tool
-> charge partial item cost.

positions
Calculate effort based on wanted positions from last tick
evaluate how the wanted position effects the total effort (in EffortGetToPos) -> estimation
Use requested positions also to define where to search for blocks to mine -> more on path
Weights of position especially important for like individual blocks -> maybe don't search for individual blocks, but rather patches

**for avoidance:**
avoid loosing stuff: chance of death * costs of inventory

### Potential changes
- for long actions evaluate states after 1 tick instead of after full action
- track Factors dependencies, to keep factors cached but recalc if dependencies change
    -> requires better tracking of inventorychanges etc. -> as Factors
    -> Only recalc needed
    -> allows for Actions to modify factors instead of botstate -> less conflicts
    -> better performance
    -> challenges handling things like blockdata -> probably not store all blocks
    -> more advanced
        -> make Factors with precision levels
        -> dynamicly calculate Factors which are most relevant first
        
        Approach of Trigger based Factor calculation
        The Game changes some fixed Factors like positions or inventory or mobs
        If a Factor get's changed by more then 10% dependend Factors get recalculated (10% can be adjusted -> impacts performance)
        Actions depending on Factors -> big changes -> reevaluate Action (not during simulation of other Action)

        Idea: figure Actions out without calcing the whole thing
        figure out which Actions are benefitial -> would require weighting of Factors -> not as accurate as direct calculation

