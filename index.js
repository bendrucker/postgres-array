'use strict'

const BACKSLASH = '\\'
const DQUOT = '"'
const LBRACE = '{'
const RBRACE = '}'
const LBRACKET = '['
const EQUALS = '='
const COMMA = ','

/** When the raw value is this, it means a literal `null` */
const NULL_STRING = 'NULL'

const EXPECT_VALUE = 0
const SIMPLE_VALUE = 1
const QUOTED_VALUE = 2
const EXPECT_DELIM = 3

exports.parse = function (source, transform) {
  // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
  let position = 0
  if (source[position] === LBRACKET) {
    position = source.indexOf(EQUALS) + 1
    if (position === 0) throw new Error('invalid array text - bad indicies')
  }

  if (source[position++] !== LBRACE) {
    throw new Error('invalid array text - missing lbrace')
  }

  const rbraceIndex = source.length - 1
  if (source[rbraceIndex] !== RBRACE) {
    throw new Error('invalid array text - missing rbrace')
  }

  const entries = []
  let current = entries
  const stack = []

  let currentStringStart = position
  const currentStringParts = []
  let mode = EXPECT_VALUE
  const haveTransform = transform != null

  function delim () {
    if (mode === SIMPLE_VALUE) {
      const part = source.slice(currentStringStart, position)
      current.push(
        part === NULL_STRING ? null : haveTransform ? transform(part) : part
      )
    }
  }

  for (; position < rbraceIndex; position++) {
    const char = source[position]
    if (mode === QUOTED_VALUE) {
      if (char === BACKSLASH) {
        // We contain escaping, so we have to do it the slow way
        const part = source.slice(currentStringStart, position)
        currentStringParts.push(part)
        currentStringStart = ++position
      } else if (char === DQUOT) {
        const part = source.slice(currentStringStart, position)
        if (currentStringParts.length > 0) {
          const final = currentStringParts.join('') + part
          current.push(haveTransform ? transform(final) : final)
          currentStringParts.length = 0
        } else {
          current.push(haveTransform ? transform(part) : part)
        }
        mode = EXPECT_DELIM
      } else {
        continue
      }
    } else if (char === DQUOT) {
      // It's escaped
      mode = QUOTED_VALUE
      currentStringStart = position + 1
    } else if (char === LBRACE) {
      const newArray = []
      current.push(newArray)
      stack.push(current)
      current = newArray
      currentStringStart = position + 1
      mode = EXPECT_VALUE
    } else if (char === COMMA) {
      delim()
      mode = EXPECT_VALUE
    } else if (char === RBRACE) {
      delim()
      mode = EXPECT_DELIM
      const arr = stack.pop()
      if (arr === undefined) {
        throw new Error('array dimension not balanced')
      }

      current = arr
    } else if (mode === EXPECT_VALUE) {
      currentStringStart = position
      mode = SIMPLE_VALUE
    } else if (mode === SIMPLE_VALUE) {
      continue
    } else if (mode === EXPECT_DELIM) {
      throw new Error('expected delimeter')
    } else {
      throw new Error('unexpected mode')
    }
  }

  delim()

  if (stack.length !== 0) {
    throw new Error('array dimension not balanced')
  }

  return entries
}
