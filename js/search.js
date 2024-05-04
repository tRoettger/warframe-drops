const fs = require('node:fs');
const argsMap = require("./arg-mapping.js");
const FILE_NAME = argsMap.get("--file");
const ITEM = argsMap.get("--item");
const MIN_PROP = argsMap.get("--minProp");

const processFile = (data) => {
    const missions = findMissions(JSON.parse(data), ITEM, MIN_PROP || 0).sort(compareRewards);
    for(let mission of missions) {
        let type = mission.mission.type;
        if(mission.rotation) {
            type += ` (${mission.rotation})`;
        }
        console.log(`${mission.reward.item} (${mission.reward.properbility.toFixed(2)}%) : ${type} - ${mission.mission.name}/${mission.mission.planet}`);
    }
};

const compareRewards = (a, b) => {
    let itemCompare = a.reward.item.localeCompare(b.reward.item);
    if(itemCompare == 0) {
        return b.reward.properbility - a.reward.properbility;
    } else {
        return itemCompare;
    }
};

const findMissions = (missions, item, minProp) => {
    const filteredMissions = [];
    for(let mission of missions) {
        for(let reward of findRewards(mission, item, minProp)){
            filteredMissions.push(reward);
        }
    }
    return filteredMissions;
}

const findRewards = (mission, item, minProp) => {
    const rewards = [];
    if(mission.rotations) {
        for(let rotatation of mission.rotations) {
            for(let reward of findInRewards(mission, rotatation.rewards, item, minProp)) {
                reward.rotation = rotatation.name;
                rewards.push(reward);
            }
        }
    } else {
        for(let reward of findInRewards(mission, mission.rewards, item, minProp)) {
            rewards.push(reward);
        }
    }
    return rewards;
};

const findInRewards = (mission, rewards, item, minProp) => {
    return rewards
        .filter(reward => reward.item.includes(item) && reward.properbility >= minProp)
        .map(reward => ({reward, mission}));
}

fs.readFile(FILE_NAME, 'utf-8', (err, data) => {
    if(err) {
        console.error(err);
    } else {
        processFile(data);
    }
});