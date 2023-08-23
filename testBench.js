const util = require('util');
const fs = require('fs')
const exec = util.promisify(require('child_process').exec);

const Benchmark = require('benchmark')
const { machineIdSync } = require('node-machine-id')

const pjson = require('./package.json')

const saveResult = (data, key) => {
  if (fs.existsSync('result.json')) {
    const fileData = JSON.parse(fs.readFileSync('result.json'))
    if (fileData[key]) {
      fileData[key].push(data)
    } else {
      fileData[key] = [data]
    }
    fs.writeFileSync('result.json', JSON.stringify(fileData, null, 2))
  } else {
    fs.writeFileSync('result.json', JSON.stringify({
      [key]: [data]
    }, null, 2))
  }
}

const testBench = (key, fn) => {
  test(
    key,
    () =>
      new Promise((resolve, reject) => {
        const bm = Benchmark(key, {
          fn,
          onComplete: () => {
            delete bm.stats.sample
            exec('git rev-parse --short HEAD').then(({ stdout, stderr }) => {
              const data = {
                stats: bm.stats,
                times: bm.times,
                count: bm.count,
                cycles: bm.cycles,
                hz: bm.hz,
                meta: {
                  commit: stdout.trim(),
                  version: pjson.version,
                  mId: machineIdSync(true)
                }
              }
              saveResult(data, key)
              resolve(null);
            })
          },
          onError: () => {
            reject(bm.error);
          },
        });
        bm.run({ async: true });
      }),
  );
}


module.exports = {
  testBench
}
