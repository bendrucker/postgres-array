
const { parse } = require('./')

// console.log(parse('{1,2,3}', (num) => Number(num)))
function intArray (string) {
  return parse(string, value => parseInt(value, 10))
}

// console.log(intArray('[0:2]={1,2,3}'))

console.log(parse('{""}'))

// console.log(parse('{"\\"\\"\\"","\\\\\\\\\\\\"}'))
