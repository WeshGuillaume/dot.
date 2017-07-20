
import { ParserError } from './errors'
import { createState } from './state'
import { parser } from './parser'

const satisfy = fun => parser(
  state => {
    const ch = state.value.input.charAt(0)
    if (!func(ch)) {
      return state.error(new ParserError(`Unexpected token '${ch}'`, state))
    }
    state.consumeChar(ch)
    return state.return(ch)
  }
)

const char = c => parser(
  satisfy(v => v === c && v.length > 0)
)

const state = createState({ input: 'a' })
const parser = char('a')
console.log(parser(state))
