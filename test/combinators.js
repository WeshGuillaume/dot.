
import { expect } from 'chai'

import { NO_MATCH } from '../src/errors'
import { symbol } from '../src/strings'
import { createState } from '../src/state'
import { space, char } from '../src/chars'

import {
  lexeme,
  skip,
  sepBy1,
  between,
  maybe,
  many,
  many1,
  sequence,
  oneOf,
} from '../src/combinators'

describe('Combinators', () => {

  it('should return NO_MATCH', () => {
    const state = createState('hello')
    const parser = maybe(symbol('world'))
    const ret = parser(state)
    expect(ret).to.equal(NO_MATCH)
    expect(state('input')).to.equal('hello')
  })

  it('should return a match', () => {
    const state = createState('hello world')
    const parser = maybe(symbol('hello'))
    const ret = parser(state)
    expect(ret).to.equal('hello')
    expect(state('input')).to.equal(' world')
  })

  it('should return a simple sequence', () => {
    const state1 = createState("hello i'm guillaume")
    const state2 = createState("hello i am guillaume")

    const parser = sequence(
      oneOf(symbol('hello'), symbol('hi')),
      space,
      char('i'),
      maybe(char("'")),
      maybe(space),
      oneOf(char('m'), symbol('am')),
      space,
      symbol('guillaume')
    )

    const ret1 = parser(state1)
    const ret2 = parser(state2)

    expect(ret1).to.eql([ 'hello', ' ', 'i', '\'', 'm', ' ', 'guillaume' ])
    expect(ret2).to.eql([ 'hello', ' ', 'i', ' ', 'am', ' ', 'guillaume' ])
    expect(state1('input')).to.equal('')
    expect(state2('input')).to.equal('')
  })

  it('should return oneOf two parsers and succeed', () => {
    const state = createState('world hello')
    const parser = oneOf(symbol('hello'), symbol('world'))
    const ret = parser(state)

    expect(ret).to.equal('world')
    expect(state('input')).to.equal(' hello')
  })

  it('should fail oneOf', () => {
    const state = createState('hello world')
    const parser = oneOf(symbol('hella'), symbol('monde'))
    const ret = () => parser(state)

    expect(ret).to.throw(Error)
    expect(state('input')).to.equal('hello world')
  })

  it('should not parse anything', () => {
    const state = createState('hello world')
    const parser = many(symbol('check'))
    const ret = parser(state)

    expect(ret).to.eql([])
    expect(state('input')).to.equal('hello world')
  })

  it('should parse 2 words', () => {
    const state = createState('hello world guillaume')
    const parser = many(oneOf(symbol('hello '), symbol('world ')))
    const ret = parser(state)

    expect(ret).to.eql(['hello ', 'world '])
    expect(state('input')).to.equal('guillaume')
  })

  it('should fail because of many1', () => {
    const state = createState('hello world')
    const parser = many1(symbol('check'))
    const ret = () => parser(state)

    expect(ret).to.throw(Error)
    expect(state('input')).to.equal('hello world')
  })

  it('should parse the word between hellos', () => {
    const state = createState('helloworldhello')
    const hello = symbol('hello')
    const parser = between(hello, hello)(symbol('world'))
    const ret = parser(state)

    expect(ret).to.equal('world')
    expect(state('input')).to.equal('')
  })

  it('should parse a list of hellos separated by commas', () => {
    const state = createState('hello,hello,hello')
    const hello = symbol('hello')
    const parser = sepBy1(char(','))(hello)
    const ret = parser(state)

    expect(ret).to.eql(['hello', 'hello', 'hello'])
    expect(state('input')).to.equal('')
  })

  it('should skip everything', () => {
    const state = createState('aaaa')
    const parser = sequence(
      skip(char('a')),
      skip(char('a')),
      skip(char('a')),
      skip(char('a'))
    )

    const ret = parser(state)
    expect(ret).to.eql([])
    expect(state('input')).to.equal('')
  })

  it('should parse a lexeme of string', () => {
    const state = createState('   hello  world')
    const parser = lexeme(symbol('hello'))
    const ret = parser(state)

    expect(ret).to.equal('hello')
    expect(state('input')).to.equal('world')
  })

})
