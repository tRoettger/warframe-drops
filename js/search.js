const fs = require('node:fs');
const argsMap = require("./arg-mapping.js");
const FILE_NAME = argsMap.get("--file");
const ITEM = argsMap.get("--item");
const MIN_PROP = argsMap.get("--minProp");
const BLACKLIST = argsMap.get("--blacklist") || argsMap.get("-x");
const WHITELIST = argsMap.get("--whitelist") || argsMap.get("-w");
const CASE_INSENSITIVE = argsMap.get("--caseinsensitive") || argsMap.get("-i");

console.log("case insensitve", CASE_INSENSITIVE);

const readFile = (file) => new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
});

const processFile = (data) => {
    const missions = findMissions(JSON.parse(data), ITEM, MIN_PROP || 0).sort(compareRewards);
    postProcessMissions(missions);
};

const postProcessMissions = (missions) => {
    let promise;
    if(BLACKLIST) {
        promise = readFile(BLACKLIST)
            .then((data) => missions.filter(filterByBlacklist(data)))
            .catch((err) => {
                console.log("Could not read blacklist.", err);
                return [];
            });
    } else if(WHITELIST) {
        promise = readFile(WHITELIST)
            .then((data) => missions.filter(filterByWhitelist(data)))
            .catch((err) => {
                console.log("Could not read whitelist.", err);
                return [];
            });
    } else {
        promise = new Promise((resolve, reject) => resolve(missions));
    }
    promise.then(printMissions);
};

const MISSION_REGEX = /(?<type>[^\()]+)[\s\(]{0,1}(?<rotation>Rotation\s[A-Z]*)[\)]{0,1}/;

const filterByBlacklist = (data) => {
    const conditions = createMissionFilters(data)
    return (mission) => !conditions.some(condition => condition(mission));
};

const filterByWhitelist = (data) => {
    const conditions = createMissionFilters(data);
    return (mission) => conditions.some(condition => condition(mission));
}

const createMissionFilters = (data) => {
    const missionlist = data
        .replaceAll("\r", "")
        .split("\n")
        .map(mission => mission.trim())
        .filter(mission => mission.length > 0);
    const conditions = [];
    for(let item of missionlist) {
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
    return conditions;
}

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

if(WHITELIST && BLACKLIST) {
    console.error("--blacklist and --whitelist cannot be used at the same time.");
} else {
    readFile(FILE_NAME)
        .then(processFile)
        .catch(console.error);
}