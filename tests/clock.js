
import { expect } from 'chai'

const date = null

function test(input, output) {
  if (!output) {
    return it(input)
  }
  const state = createState({ input })
  const result = date(state)
  expect(result.value.return).to.eql(output)
}

describe('Clock', () => {
  test('1 hour')
  test('1h')
  test('1h30')
  test('1minute')
  test('5 minute 30')
  test('1:03')
})
