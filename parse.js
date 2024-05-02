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

