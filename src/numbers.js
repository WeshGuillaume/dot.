
import { parser } from './parser'
import { char, digit } from './chars'
import { many1, many, oneOf, sequence } from './combinators'

const integer = parser(
  'integer',
  state => {
    return many1(digit)(state)
      .return(value => value.join(''))
  }
)

const float = parser(
  'float',
  state => {
    return sequence(
      integer, char('.'), integer
    )(state).return(value => value.join(''))
  }
)

const number = parser('number', oneOf(float, integer))

export {
  number,
  integer,
  float,
}
