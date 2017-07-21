
import { createState } from '../src/state'
import {
  char,
  digit,
} from '../src/chars'

describe('Chars', () => {

  it('match a specified char', () => {
    const source = 'abcdef'
    const state = createState({ input: source })

    const s1 = char('a')(state)
    expect(s1.value.return).to.equal('a')
    expect(s1.value.error).to.equal(null)
  })

  it('match a digit')
  it('match a letter')
  it('match an operator')
  it('match an alpha-numeric char')
  it('match a space')
  it('match noneOf')

})
