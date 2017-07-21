
import { parser } from './parser'
import { createState } from './state'

import * as c from './combinators'
import * as s from './strings'
import * as ch from './chars'

/*
 * sequence: parser1 >> parser2 >> parser3
 * maybe: parser1?
 * oneOf: parser1 | parser2 | parser3
 * sepBy: [parser1, separator...]
 * sepBy1: [parser1, separator...]!
 * skip: -parser
 * skipMany: -parser...
 * many: parser*
 * many1: parser+
 *
 */
