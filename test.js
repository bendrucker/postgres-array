'use strict'

const { parse } = require('./')
const { testBench } = require('./testBench')

// test(function (t) {
//   const string = array.parse
//   t.deepEqual(string('{}'), [], 'empty')
//   t.deepEqual(string('{""}'), [''], 'empty string')
//   t.deepEqual(string('{1,2,3}'), ['1', '2', '3'], 'numerics')
//   t.deepEqual(string('{a,b,c}'), ['a', 'b', 'c'], 'strings')
//   t.deepEqual(string('{"\\"\\"\\"","\\\\\\\\\\\\"}'), ['"""', '\\\\\\'], 'escaped')
//   t.deepEqual(string('{NULL,NULL}'), [null, null], 'null')
//
//   t.deepEqual(intArray('{1,2,3}'), [1, 2, 3], 'numerics')
//   t.deepEqual(intArray('[0:2]={1,2,3}'), [1, 2, 3], 'numerics')
//
//   t.end()
// })


// const bm = Benchmark('key', {
//   fn: () => /o/.test('Hello World!'),
//   onComplete: () => {
//     console.log(bm)
//   }
// })
// bm.run({ async: true })



const deviceTypes = {
  VT: 'VT',
    '3S': '3S',
    '3X': '3X',
    P61: 'P61',
    P5: 'P5',
    P61B: 'P61B',
    P7: 'P7',
    N910: 'N910'
}

const isTerminalCase = (deviceType) => {
  switch (deviceType) {
    case deviceTypes.P61:
    case deviceTypes.P5:
    case deviceTypes.P61B:
    case deviceTypes.P7:
    case deviceTypes.N910:
      return true;
    default:
      return false;
  }
};

const isTerminalInclude = (deviceType) => {
  return [deviceTypes.P61, deviceTypes.P5, deviceTypes.P61B, deviceTypes.P7, deviceTypes.N910].includes(deviceType)
};



describe('my beverage', () => {
  // testBench('empty', () => {
  //   expect(parse('{}')).toStrictEqual([])
  // })

  testBench('isTerminalCase', () => {
    expect(isTerminalCase('P7')).toBe(true)
  })

  testBench('isTerminalInclude', () => {
    expect(isTerminalInclude('P7')).toBe(true)
  })

  //
  // testBench('empty string', () => {
  //   expect(parse('{""}')).toStrictEqual([''])
  // })
  //
  // testBench('numerics', () => {
  //   expect(parse('{1,2,3}')).toStrictEqual(['1', '2', '3'])
  // })
  //
  // testBench('strings', () => {
  //   expect(parse('{a,b,c}')).toStrictEqual(['a', 'b', 'c'])
  // })
  //
  // testBench('escaped', () => {
  //   expect(parse('{"\\"\\"\\"","\\\\\\\\\\\\"}')).toStrictEqual(['"""', '\\\\\\'])
  // })
  //
  // testBench('null', () => {
  //   expect(parse('{NULL,NULL}')).toStrictEqual([null, null])
  // })
  //
  // test('numerics', () => {
  //   expect(intArray('{1,2,3}')).toStrictEqual([1, 2, 3])
  // })
  //
  // test('numerics range', () => {
  //   expect(intArray('[0:2]={1,2,3}')).toStrictEqual([1, 2, 3])
  // })
})

function intArray (string) {
  return parse(string, value => parseInt(value, 10))
}




// const { measure, performance } = require('jest-measure')
//
//


// measure('your test name', async () => {
//   performance.mark('load')
//   const string = array.parse
//   expect(string('{1,2,3}')).toStrictEqual(['1', '2', '3'])
//   await new Promise(resolve => setTimeout(resolve, 50))
//   performance.mark('loaded')
//   performance.measure('load-time', 'load', 'loaded')
//
// })


// test('example', async () => {
//   await new Promise(resolve => setTimeout(resolve, 1000));
// }, 1500);


// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }
