// import { benchmarkSuite } from "jest-bench";
const jestBench = require('jest-bench')

let a;

jestBench.benchmarkSuite("sample", {
  // setup will not run just once, it will run for each loop
  setup() {
    a = [...Array(10e2).keys()];
  },

  // same thing with teardown
  teardown() {
    if (a.length < 10e6) a.unshift(0);
  },

  ["Array.indexOf"]:  () => {
    a.indexOf(555599);
  },

  ["delete Array[i]"]: () => {
    expect(a.length).toEqual(10e6);
    delete a[0];
  },

  ["Array.unshift"]: () => {
    a.unshift(-1);
  },

  ["Array.push"]: () => {
    a.push(1000000);
  },
});
