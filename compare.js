const fs = require('fs');

const Table = require('cli-table');

const table = new Table();
const result = JSON.parse(fs.readFileSync('result.json'))

const myArgs = process.argv.slice(2);
const resNum = Number(myArgs[0])

const formatPeriod = (num) => {
  if (num < 10 ** -6) {
    return `${(num * 10 ** 6).toFixed(3)} μs`;
  } else if (num < 10 ** -3) {
    return `${(num * 10 ** 3).toFixed(3)} ms`;
  } else if (num < 1) {
    return `${(num * 10 ** 3).toFixed(2)} ms`;
  }
  return `${num.toFixed(2)} s`;
};

const resStat = Object.keys(result).map(testName => {
  return {[testName]: result[testName].slice(-resNum).map(testStat => formatPeriod(testStat.times.period))}
})

table.push(
  { 'Test name': [...Array(resNum).keys()].map(item => `mean ${item + 1}`) },
  ...resStat
);

console.log(table.toString());
