const ArgMapper = () => {
    const argsMap = new Map();
    let key;
    for(let argv of process.argv) {
        if(key) {
            argsMap.set(key, argv);
            key = undefined;
        } else {
            key = argv;
        }
    }
    
    return argsMap;
};
module.exports = ArgMapper();