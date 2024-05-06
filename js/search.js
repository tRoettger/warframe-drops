const fs = require('node:fs');
const argsMap = require("./arg-mapping.js");
const FILE_NAME = argsMap.get("--file");
const ITEM = argsMap.get("--item");
const MIN_PROP = argsMap.get("--minProp");
const BLACKLIST = argsMap.get("--blacklist");

const processFile = (data) => {
    const missions = findMissions(JSON.parse(data), ITEM, MIN_PROP || 0).sort(compareRewards);
    postProcessMissions(missions);
};

const postProcessMissions = (missions) => {
    if(BLACKLIST) {
        fs.readFile(BLACKLIST, "utf-8", (err, data) => {
            if(err) {
                console.log("Could not read blacklist.");
            } else {
                printMissions(missions.filter(filterByBlacklist(data)));
            }
        });
    } else {
        printMissions(missions);
    }
};

const MISSION_REGEX = /(?<type>[^\()]+)[\s\(]{0,1}(?<rotation>Rotation\s[A-Z]*)[\)]{0,1}/;

const filterByBlacklist = (data) => {
    const blacklist = data
        .replaceAll("\r", "")
        .split("\n")
        .map(mission => mission.trim())
        .filter(mission => mission.length > 0);
    const conditions = [];
    for(let item of blacklist) {
        const itemMatch = item.match(MISSION_REGEX);
        if(itemMatch && itemMatch.groups) {
            conditions.push(isMissionWithRotation(
                itemMatch.groups.type.trim(),
                itemMatch.groups.rotation.trim()
            ));
        } else {
            conditions.push(isMissionWithType(item.trim()));
        }
    }
    return (mission) => !conditions.some(condition => condition(mission));
};

const isMissionWithType = (type) => {
    return (mission) => mission.mission.type == type;
};

const isMissionWithRotation = (type, rotation) => {
    return (mission) => (
        mission.mission.type == type 
        && mission.rotation 
        && mission.rotation == rotation
    );
};

const printMissions = (missions) => {
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