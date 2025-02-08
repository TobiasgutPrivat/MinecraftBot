import Bot from "./Bot";
import OwnItem from "./Targets/OwnItem";

const steve = new Bot("steve");
steve.goals.push(new OwnItem("dirt", 32));