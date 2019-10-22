const napa = require('napajs');
const NUM_OF_WORKERS = 16;
const zone1 = napa.zone.create('zone1', { workers: NUM_OF_WORKERS });
const worker = require('./worker');
const levenshtein = require('./levenshtein');

// // Broadcast code to all 4 workers in 'zone1'.
// zone1.broadcast('console.log("hello world");');


module.exports = (array, maxDistance) => {

    const chunkSize = Math.ceil(array.length / NUM_OF_WORKERS);
    const promises = [];
    const promisesResults = [];

    for (let i = 0 ; i < NUM_OF_WORKERS; i ++) {
        const chunk = array.slice(i * chunkSize, (i + 1) * chunkSize);
        console.log('New worker to help calculate histogram, chunksize: ' + chunk.length);
        promises.push(
            zone1.execute(worker, [chunk, maxDistance])
        );
    }

    return Promise.all(promises).then(values => {
        console.log('Starting to post process results from all threads');
        const results = {};
        values.forEach(v => {
            const value = JSON.parse(v._payload);
            const sqls = Object.keys(value);
            for (let i = 0 ; i < sqls.length; i++) {
                const sql = sqls[i];
                const resultKeys = Object.keys(results);

                if (resultKeys.length === 0) {
                    results[sql] = value[sql];
                    continue;
                }

                let added = false;

                for (let j = 0; j < resultKeys.length; j++) {
                    if (added) {
                        continue;
                    }
                    const existingSql = resultKeys[j];
                    if (levenshtein(sql, existingSql) < maxDistance) {
                        results[existingSql] += value[sql];
                        added = true;
                    }
                }
                if (!added) {
                    results[sql] = value[sql];
                }

            }
        });

        const processedCount = Object.keys(results).reduce((acc, cv) => {
            acc += results[cv];
    
            return acc;
        }, 0);
        
        console.log(`Postprocess is finished, processed ${processedCount} records`);

        return results;
    });
}