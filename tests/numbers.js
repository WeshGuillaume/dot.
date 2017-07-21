
import { expect } from 'chai'

import { createState } from '../src/state'
import { number, integer, float } from '../src/numbers'

function testSuccess (parser, input, output) {
  it(`Success: ${parser.parserName}`, () => {
    const state = createState({ input })
    const result = parser(state)
    expect(result.value.return).to.equal(output)
    expect(result.value.error).to.equal(null)
  })
}

describe('Numbers', () => {

  testSuccess(integer, '123d', '123')
  testSuccess(float, '1.2s', '1.2')
  testSuccess(number, '213.23', '213.23')

})
