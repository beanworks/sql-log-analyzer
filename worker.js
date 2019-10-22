
module.exports = (array, maxDistance) => {
    const levenshtein = require('./levenshtein');
    const totalCount = array.length;
    const chunk = Math.ceil(totalCount / 10);

    const result = {};
    
    for (let i = 0; i < array.length; i++) {
        if (i % chunk === 0) {
            console.log("One of the works's progress: " + (i / chunk) * 10 + "%")
        }
        const element = array[i];
        const keys = Object.keys(result);
        if (keys.length === 0) {
            result[element] = 0;
            continue;
        }

        let added = false;
        for (let j = 0; j < keys.length; j++) {
            if (added) {
                continue;
            }

            const key = keys[j];
            const distance = levenshtein(key, element);
            if (distance < maxDistance) {
                result[key] += 1;
                added = true;
            } 
        }
        if (!added) {
            result[element] = 1;
        }
    }

    const processedCount = Object.keys(result).reduce((acc, cv) => {
        acc += result[cv];

        return acc;
    }, 0);
    
    console.log(`One of the works is finished, processed ${processedCount} records`);
    return result;
}