const fs = require('node:fs');
const FILE_NAME = process.argv[2];
const ITEM = process.argv[3];
const MIN_PROP = process.argv[4];

const processFile = (data) => {
    const missions = findMissions(JSON.parse(data), ITEM, MIN_PROP || 0).sort(compareProp);
    for(let mission of missions) {
        console.log(`${mission.reward.item} (${mission.reward.properbility.toFixed(2)}%) : ${mission.mission.type} - ${mission.mission.name}/${mission.mission.planet}`);
    }
};

const compareProp = (a, b) => {
    return b.reward.properbility - a.reward.properbility;
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