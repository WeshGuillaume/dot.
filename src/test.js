
import { NO_MATCH, ParseError } from './errors'
import { createState } from './state'
import { parser } from './parser'
import { maybe } from './combinators'

const satisfy = fun => parser(
  'a character',
  state => {
    const ch = state.value.input.charAt(0)
    if (!fun(ch)) {
      return state.error(new ParseError(`Unexpected token '${ch}'`, state))
    }
    state.consumeChar(ch)
    return state.return(() => ch)
  }
)

const char = c => parser(
  `character '${c}'`,
  satisfy(v => v === c && v.length > 0),
)

const sequence = (...ps) => parser(
  `a sequence of [${ps.map(({ parserName }) => parserName).join(', ')}]`,
  state => {
    return ps.reduce(
      (s, p) => p(s).return(v => [...s.value.return, v]),
      state.return(() => [])
    )
  },
  v => v.filter(e => e !== NO_MATCH),
  true
)

const ab = sequence(char('a'), maybe(char('b')), char('c'))

const s = createState({ input: 'axc' })
const p = ab(s)
console.log(p.value)
