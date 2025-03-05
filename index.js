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

/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 *
 * Trusts the data (mostly), so only hook up to trusted Postgres servers.
 */
function makeParseArrayWithTransform (transform) {
  const haveTransform = transform != null
  return function parseArray (str) {
    // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
    let position = 0
    if (str[position] === LBRACKET) {
      position = str.indexOf(EQUALS) + 1
    }

    if (str[position++] !== LBRACE) {
      throw new Error('Invalid array text - must start with {')
    }
    const rbraceIndex = str.length - 1
    if (str[rbraceIndex] !== RBRACE) {
      throw new Error('Invalid array text - must end with }')
    }
    const output = []
    let current = output
    const stack = []

    let currentStringStart = position
    const currentStringParts = []
    let hasStringParts = false
    let expectValue = true

    for (; position < rbraceIndex; ++position) {
      let char = str[position]
      // > The array output routine will put double quotes around element values if
      // > they are empty strings, contain curly braces, delimiter characters, double
      // > quotes, backslashes, or white space, or match the word NULL. Double quotes
      // > and backslashes embedded in element values will be backslash-escaped.
      if (char === DQUOT) {
        // It's escaped
        currentStringStart = ++position
        let dquot = str.indexOf(DQUOT, currentStringStart)
        let backSlash = str.indexOf(BACKSLASH, currentStringStart)
        while (backSlash !== -1 && backSlash < dquot) {
          position = backSlash
          const part = str.slice(currentStringStart, position)
          currentStringParts.push(part)
          hasStringParts = true
          currentStringStart = ++position
          if (dquot === position++) {
            // This was an escaped doublequote; find the next one!
            dquot = str.indexOf(DQUOT, position)
          }
          // Either way, find the next backslash
          backSlash = str.indexOf(BACKSLASH, position)
        }
        position = dquot
        const part = str.slice(currentStringStart, position)
        if (hasStringParts) {
          const final = currentStringParts.join('') + part
          current.push(haveTransform ? transform(final) : final)
          currentStringParts.length = 0
          hasStringParts = false
        } else {
          current.push(haveTransform ? transform(part) : part)
        }
        expectValue = false
      } else if (char === LBRACE) {
        const newArray = []
        current.push(newArray)
        stack.push(current)
        current = newArray
        currentStringStart = position + 1
        expectValue = true
      } else if (char === COMMA) {
        expectValue = true
      } else if (char === RBRACE) {
        expectValue = false
        const arr = stack.pop()
        if (arr === undefined) {
          throw new Error("Invalid array text - too many '}'")
        }
        current = arr
      } else if (expectValue) {
        currentStringStart = position
        while (
          (char = str[position]) !== COMMA &&
          char !== RBRACE &&
          position < rbraceIndex
        ) {
          ++position
        }
        const part = str.slice(currentStringStart, position--)
        current.push(
          part === NULL_STRING ? null : haveTransform ? transform(part) : part
        )
        expectValue = false
      } else {
        throw new Error('Was expecting delimeter')
      }
    }

    return output
  }
}

const parseArray = makeParseArrayWithTransform()

exports.parse = (source, transform) =>
  transform != null
    ? makeParseArrayWithTransform(transform)(source)
    : parseArray(source)
