const ArgMapper = () => {
    const argsMap = new Map();
    let key;
    for(let argv of process.argv) {
        if(key) {
            if(argv.startsWith("-")) {
                argsMap.set(key, true);
                key = argv;
            } else {
                argsMap.set(key, argv);
                key = undefined;
            }
        } else {
            key = argv;
        }
    }
    if(key) {
        argsMap.set(key, true);
    }
    
    return argsMap;
};
module.exports = ArgMapper();