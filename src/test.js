
import { NO_MATCH, ParseError } from './errors'
import { createState } from './state'
import { date } from './date'

const testStrings = [
  '1 hour and 5 minutes',
  '1 hour and 10',
  '1:05',
  '2 minutes 2 seconds',
  '12hours',
].forEach(input => {
  const state = createState({ input })
  console.log(date(state).value.return)
})

