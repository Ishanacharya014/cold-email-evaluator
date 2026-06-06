import { loadSkill } from "./skill/skill-loader.js";

const skill = loadSkill();

console.log("Skill Loaded");
console.log("Version:", skill.version);

console.log("\nRubric Length:");
console.log(skill.rubric.length);

console.log("\nExamples Length:");
console.log(skill.examples.length);