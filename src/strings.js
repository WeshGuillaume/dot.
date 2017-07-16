
const { sequence } = require('./combinators')
const { char } = require('./chars')

/**
 * Strings
 * ----------------------------------------------------------------------------
 */

/**
 * symbol
 *
 * parse a string using a sequence of char parsers
 */
function symbol (str) {
  return state => {
    return sequence(...str.split('').map(char))(state).join('')
  }
}

module.exports = { symbol }
