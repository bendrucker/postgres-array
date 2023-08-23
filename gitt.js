// const execa = require('execa')


// execa.execa('git rev-parse --short HEAD').then(res => {
//   console.log(res)
// })


// const { exec } = require('child_process');

const util = require('util');
const exec = util.promisify(require('child_process').exec);
//
// exec('git rev-parse --short HEAD'), (error, stdout, stderr) => {
//   console.log(stdout)
//   console.log(stdout)
//   console.log(stderr)
// }

// exec('git rev-parse --short HEAD').then(({ stdout, stderr }) => {
//   console.log(stdout)
// })

var pjson = require('./package.json');
console.log(pjson)


const  {machineId, machineIdSync} = require('node-machine-id')
console.log(machineIdSync(true))


var Table = require('cli-table');

// instantiate
// var table = new Table({
//   head: ['TH 1 label', 'TH 2 label']
// });
//
// // table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//   ['First value', 'Second value']
//   , ['First value', 'Second value']
// );
//
// console.log(table.toString());


// var Table = require('cli-table');
var table = new Table();

table.push(
  { 'Some key': ['Some value', 'sd'] }
  , { 'Another key': ['Another value', 'sd'] }
);

console.log(table.toString());

console.log([...Array(10).keys()].map(item => `res ${item}`))
