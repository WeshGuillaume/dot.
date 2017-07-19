
import { char, digit } from './chars'
import { many1, many, oneOf, sequence } from './combinators'

function integer (state) {
  const s = many1(digit)(state.clone())
  if (s.value.error) {
    return state.error(s.value.error)
  }
  return s.return(s.value.return.join(''))
}

function float (state) {

  const s = state.clone()

  const ret = sequence(
    integer, char('.'), integer
  )(s)

  if (ret.value.error) {
    return state.error(ret.value.error)
  }

  return ret.return(ret.value.return.join(''))
}

const number = oneOf(float, integer)

export {
  number,
  integer,
  float,
}
