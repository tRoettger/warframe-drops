const REGEX_NAME = /\<th\scolspan\=\"2\"\>(?<name>.*?)\<\/th\>/;
const REGEX_ROW = /\<tr\>(?<content>.*?)\<\/tr\>/g;
const REGEX_MISSION = /(?<planet>[^\/]*)\/(?<name>[^\()]*)\((?<type>[^\)]*)/;
const REGEX_REWARD = /\<td\>(?<item>[\s\S]*)\<\/td\>\<td\>(?<rarity>[a-zA-Z\s]*)\((?<properbility>.*)\%\)\<\/td\>/;

const argsMap = require("./arg-mapping.js");
const line = argsMap.get("--line");

const mission = {};
for( let match of line.matchAll(REGEX_ROW)) {
    try {
        let nameMatch = match.groups.content.match(REGEX_NAME);
        if(nameMatch) {
            if(mission.name) {
                mission.rotations ??= [];
                mission.rotations.push({ name: nameMatch.groups.name });
            } else {
                let missionMatch = nameMatch.groups.name.match(REGEX_MISSION);
                if(missionMatch) {
                    mission.name = missionMatch.groups.name.trim();
                    mission.planet = missionMatch.groups.planet.trim();
                    mission.type = missionMatch.groups.type.trim();
                } else {
                    mission.name = nameMatch.groups.name.trim();
                    mission.planet = "unknown";
                    mission.type = "Special";
                }
            }
        } else {
            let rewardMatch = match.groups.content.match(REGEX_REWARD);
            if(rewardMatch) {
                let rewards;
                if(mission.rotations) {
                    let rota = mission.rotations[mission.rotations.length - 1];
                    rota.rewards ??= [];
                    rewards = rota.rewards;
                } else {
                    mission.rewards ??= [];
                    rewards = mission.rewards;
                }
                rewards.push({
                    item: rewardMatch.groups.item.trim(),
                    rarity: rewardMatch.groups.rarity.trim(),
                    properbility: rewardMatch.groups.properbility.trim() * 1
                });
            }
        }
    } catch (error) {
        console.error(`Error occured for line: \n${line}\n`, error)
    }
}
console.log(JSON.stringify(mission));