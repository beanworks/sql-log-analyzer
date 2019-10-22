# Doctrine Log Processor
A node js utility to process the result of doctrine query log.

## Requirement
Have Node JS installed on you computer, preferably > version 10.

## Install Dependencies
`npm install`
This utility uses `napaJs` to perform tasks in multiple threads for analyzing the logs. If installing napa js errors out, you probably don't have the supported version of nodejs, try install version 10 or check their Github page to see what cersion is supported.

## Run
1. Put the doctrine log file in the root folder and call it `doctrine.log`
2. Run process.js like thi `node process.js`

## Results
The script puts the analyzed file in the `processed` folder. Each execution will override what was in `processed` folder.

`01-timestamp_histogram.log`: Is the frequency data by seconds, so that you can see how many query was executed each second.

`02-sorted_sql.log`: Contains all the SQL queries sorted alphebetically.

`03-sql_histogram.log`: Is the frequence data for each *unique* SQL query.

`04-grouped_by_levenshtein.log`: Is the frequence data for similar SQL queries (fuzzy search), this is useful when you have thousands of SQL queries that looked similar but are not exactly the same.

## Contributing
Feel free to contribute to this proect.
