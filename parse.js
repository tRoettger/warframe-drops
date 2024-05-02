const argMappers = new Map();
let line;
let processor;

const argMapping = (argv) => {
    let mapper = argMappers.get(argv);
    if(mapper) {
        processor = (argv) => {
            mapper(argv);
            processor = argMapping;
        };
    }
};
argMappers.set('--line', (argv) => line = argv);

processor = argMapping;
for(let argv of process.argv) {
    processor(argv);
}

const REGEX_NAME = /\<th\scolspan\=\"2\"\>(?<name>.*?)\<\/th\>/;
const REGEX_ROW = /\<tr\>(?<content>.*?)\<\/tr\>/g;
const REGEX_MISSION = /(?<planet>[^\/]*)\/(?<name>[^\()]*)\((?<type>[^\)]*)/;
const REGEX_REWARD = /\<td\>(?<item>[\s\S]*)\<\/td\>\<td\>(?<rarity>[a-zA-Z]*)\s\((?<properbility>.*)\%\)\<\/td\>/;

const mission = {};
for( let match of line.matchAll(REGEX_ROW)) {
    let nameMatch = match.groups.content.match(REGEX_NAME);
    if(nameMatch) {
        if(mission.name) {
            mission.rotations ??= [];
            mission.rotations.push({ name: nameMatch.groups.name });
        } else {
            let missionMatch = nameMatch.groups.name.match(REGEX_MISSION);
            mission.name = missionMatch.groups.name.trim();
            mission.planet = missionMatch.groups.planet.trim();
            mission.type = missionMatch.groups.type.trim();
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
                item: rewardMatch.groups.item,
                rarity: rewardMatch.groups.rarity,
                properbility: rewardMatch.groups.properbility * 1
            });
        }
    }
}
console.log(JSON.stringify(mission));