'use strict'

var test = require('tape')
var array = require('./')

test(function (t) {
  var string = array.parse
  t.deepEqual(string('{}'), [], 'empty')
  t.deepEqual(string('{""}'), [''], 'empty string')
  t.deepEqual(string('{1,2,3}'), ['1', '2', '3'], 'numerics')
  t.deepEqual(string('{a,b,c}'), ['a', 'b', 'c'], 'strings')
  t.deepEqual(string('{"\\"\\"\\"","\\\\\\\\\\\\"}'), ['"""', '\\\\\\'], 'escaped')
  t.deepEqual(string('{NULL,NULL}'), [null, null], 'null')

  t.end()
})
