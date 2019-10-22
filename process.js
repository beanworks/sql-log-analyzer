const fs = require('fs');
const calculateHistogram = require('./calculateHistogram');
const groupByLevenshtein = require('./groupByLevenshtein');
const sortObjectByValue = require('./sortObjectByValue');

if (!fs.existsSync('./processed')) {
    fs.mkdirSync('./processed');
}

console.log('Reading File');
const content = fs.readFileSync('./doctrine.log');
const lines = content.toString().split('\n');

const logLineObjects = lines.map(line => {
    const preTimestamp = line.split(']')[0];
    const timestamp = preTimestamp.substring(1);

    const sql = line.split('DEBUG: ')[1];

    return {timestamp, sql}
});

console.log('File is parsed');

const writeFileWithLog = (name, content, path) => {
    fs.writeFileSync(`./processed/${path}`, JSON.stringify(content, null, 2));
    console.log(`${name} is written to ${TIMESTAMP_HISTO_PATH}`);
}

// Calculate and write to timestamp histogram
const timestamps = logLineObjects.map(line => line.timestamp);
const timestampHistogram = calculateHistogram(timestamps, 'timestamp');
console.log('Timestamp histogram is calculated');
const TIMESTAMP_HISTO_PATH = '01-timestamp_histogram.log';
fs.writeFileSync(TIMESTAMP_HISTO_PATH, JSON.stringify(timestampHistogram, null, 2));
writeFileWithLog('Timestamp histogram', timestampHistogram, TIMESTAMP_HISTO_PATH);


// Sort sql queries and write them to file

const sqls = logLineObjects.map(line => line.sql);
console.log('sorting file');
const sorted = sqls.sort();
console.log('file sorted');
const SORTED_SQL_PATH = '02-sorted_sql.log'
writeFileWithLog('Sorted SQL Queries', sorted, SORTED_SQL_PATH);

// Calculate histogram for SQL queries
const histogramSQL = sortObjectByValue(calculateHistogram(sqls, 'sql query'));
const SQL_HISTO_PATH = '03-sql_histogram.log';
writeFileWithLog('SQL Histogram', histogramSQL, SQL_HISTO_PATH);

// Group SQL by Levenshtein distance of the SQL queries
const calculateLevenshtein = async () => {
    try {
        const groupedByLevenshtein = sortObjectByValue(await groupByLevenshtein(sorted, 32));
        const GROUPED_BY_LEV_PATH = '04-grouped_by_levenshtein.log';
        writeFileWithLog('SQL Grouped By Levenshtein', groupedByLevenshtein, GROUPED_BY_LEV_PATH);
    } catch (e) {
        console.error(e.message);
    }
}
calculateLevenshtein();

