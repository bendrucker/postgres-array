'use strict'

const array = require('./')
const { parse } = array
const arraysToParse = []
// We have to manually escape these
const WORDS = [
  'HELLO',
  'WORLD',
  '"' + 'Mixed \\"content\\"'.repeat(100) + '"',
  '1984',
  String(Math.MAX_SAFE_INTEGER),
  '""',
  '"{}"',
  '"' +
    JSON.stringify({ test: { this: { out: true } } }).replace(/"/g, '\\"') +
    '"'
]

for (let i = 0; i < 1000; i++) {
  const parts = []
  for (let j = 100; j < 500; j++) {
    const innerParts = []
    for (let k = 0; k < 2; k++) {
      innerParts.push(WORDS[(i + j + k) % WORDS.length])
    }
    parts.push('{' + innerParts.join(',') + '}')
  }
  arraysToParse.push('{' + parts.join(',') + '}')
}
for (let i = 0; i < 1000; i++) {
  const parts = []
  for (let j = 100; j < 500; j++) {
    const innerParts = []
    for (let k = 0; k < 2; k++) {
      innerParts.push(String(i + j + k))
    }
    parts.push('{' + innerParts.join(',') + '}')
  }
  arraysToParse.push('{' + parts.join(',') + '}')
}

const l = arraysToParse.length
console.log(`To process: ${l} arrays`)

async function main () {
  for (let i = 0; i < 10; i++) {
    // Store results so V8 doesn't optimize away our loop
    let previousResult, currentResult
    const start = process.hrtime()

    for (let i = 0; i < l; i++) {
      previousResult = currentResult
      currentResult = parse(arraysToParse[i])
    }
    const fin = process.hrtime(start)
    const dur = fin[0] * 1e3 + fin[1] * 1e-6

    console.log(previousResult ? '' : 'f')

    console.log(
      `Parsing ${l} arrays took ${dur.toFixed(1)}ms (${(l / dur).toFixed(
        1
      )} arrays/ms)`
    )
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
