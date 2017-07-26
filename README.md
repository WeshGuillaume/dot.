
### dot.

#### Regex syntax

`[a-z]` -> range between a and z

`a|b` -> a or b

`a+` -> one or more a


`a*` -> zero or more a


`{{name:a}}` -> named group matching `a`


`{a}` -> external dependency called a


`a?` -> maybe a


`(a)` -> group matching a


#### Chars

> satisfy

match a character that satisfies the provided function

``` javascript

satisfy(c => c >= 'a' && c <= 'd')

```

> char

matches a single character

``` javascript

char('c')

```

#### Strings

> symbol

matches a string

``` javascript

symbol('hello')

```

> lexeme

matches the given parser, surrounded by zero or more space

``` javascript

lexeme(symbol('hello')) // works with '   hello '

```

#### Combinators

> maybe

matches the given parser. If it fails, return `NO_MATCH`.
It can never fail.

```

maybe(symbol('hello'))

```

> many

matches zero or more occurence of the given parser

``` javascript

many(char('\n'))

```

> many1

matches one or more occurrence of the given parser

``` javascript

many1(char('\n'))

```

> sequence

matches sequencially the given parsers. If one of the returned value is `NO_MATCH`, remove it from the final return

``` javascript

sequence(char('a'), char('b'), maybe(char('c')))

```

> skip

match the given parser, and skip it

``` javascript

skip(char(' '))

```

> skipMany

skips zero or more occurence of the parser

``` javascript

const comment = /* ... */
skipMany(comment)

```

> between

``` javascript

const braces = between(char('{'), char('}'))
braces(char('a')) // {a}

```

> sepBy

matches zero or more parsers separated by a parser

``` javascript

const commaSeparated = sepBy(char(','))
commaSeparated(char('a')) // a,a,a,a

```

> sepBy1

matches zero or more parsers separated by a parser

``` javascript

const commaSeparated = sepBy(char(','))
commaSeparated(char('a')) // a,a,a,a

```

> range

matches between `min` and `max` times the provided parser

``` javascript

range(3) // max 3
range(4, 5) // between 4 and 5 occurences

```

> oneOf

matches the first successful parser in the provided ones

``` javascript

oneOf(char('a'), char('b')) // ab -> a

```

#### Programming

`// TODO`

#### Numbers

`// TODO`

#### TODO

 - [  ] Positive lookahead
 - [  ] Negative lookahead
 - [  ] Negative lookBehind
 - [  ] Positive lookBehind
 - [  ] Unit tests for regexes
 - [  ] More tests
 - [  ] Fuzzy Symbol
 - [  ] Fuzzy Sequence
