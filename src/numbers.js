
import chars from './chars'
import { many1, many, oneOf, sequence } from './combinators'

function digit (state) {
  return parseInt(chars.digit(state))
}

function integer (state) {
  const ret = many1(chars.digit)(state)
  return parseInt(ret.join(''))
}

function float (state) {

  const ret = sequence(
    integer,
    chars.char('.'),
    integer
  )(state)

  return parseFloat(ret.join(''))
}

const number = oneOf(float, integer)

export {
  number,
  integer,
  float,
  digit,
}
