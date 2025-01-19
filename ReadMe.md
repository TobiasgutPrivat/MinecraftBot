## Local setup

- Open a minecraft world in `1.21.1`. A list of supported versions by Mineflayer can be found [here](https://github.com/PrismarineJS/mineflayer/blob/master/lib/version.js#L1)
- Open the game to lan with the port `25565`
- Run `npm i`
- Run `npm run start`

## Concept

### Potential changes
- for long actions evaluate states after 1 tick instead of after full action
- track Factors dependencies, to keep factors but recalc if dependencies changed 
    -> allows for Actions to modify factors instead of botstate

### challenges

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
opt1. maybe tempstore all wanted positions -> calc shortest path between them as effort
opt2. or track wanted positions (maybe from last tick), and evaluate how the wanted position effects those (in EffortGetToPos) -> estimation

**for avoidance:**
avoid loosing stuff: chance of death * costs of inventory
