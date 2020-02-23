const fs = require('fs');
const path = require('path');
const getFilePath = level =>
    path.resolve(__dirname, `../assets/defensive-ev-spreads-${level}.json`);

const getValidEVs = (level = 50) => {
    const validEVs = [];
    let counter = 0;
    do {
        if (level === 50) {
            validEVs.push(Math.max(8 * counter - 4, 0));
        } else {
            validEVs.push(4 * counter);
        }
        counter++;
    } while (validEVs[validEVs.length - 1] < 252);
    return validEVs;
};

const appendFilePromise = (filePath, data) =>
    new Promise(resolve => {
        fs.appendFile(filePath, data, resolve);
    });

const getAllDefensiveSpreads = async (level = 50) => {
    const validEVs = getValidEVs(level);
    const maxEVs = 508;
    const atk = 0;
    const spa = 0;
    const spe = 0;

    const allEVs = [];

    for (const hp of validEVs) {
        for (const def of validEVs) {
            for (const spd of validEVs) {
                const total = hp + def + spd;
                if (total <= maxEVs) {
                    allEVs.push({
                        hp,
                        atk,
                        def,
                        spa,
                        spd,
                        spe,
                    });
                }
            }
        }
    }

    fs.writeFileSync(getFilePath(level), JSON.stringify(allEVs));
};

getAllDefensiveSpreads(50);
