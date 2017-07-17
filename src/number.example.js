
import numbers from './numbers'
import { createState } from './state'

const number = 1231.214

const state = createState(`${number}`)
const parser = numbers.float
console.log(parser(state), state())
