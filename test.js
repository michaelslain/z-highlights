import { lex, tokenize, optimize } from './index.js'
import test from 'ava'

// optimizing and tokenizing tests
test('empty string', t => t.deepEqual(optimize(tokenize('')), []))
test('chicken wing', t =>
    t.deepEqual(optimize(tokenize('function chickenWing() {}')), [
        { string: 'function', type: 'declaration' },
        { string: ' chickenWing', type: 'normal' },
        { string: '(', type: 'bracket' },
        { string: ')', type: 'bracket' },
        { string: ' ', type: 'normal' },
        { string: '{', type: 'bracket' },
        { string: '}', type: 'bracket' },
    ]))
test('string addition', t =>
    t.deepEqual(optimize(tokenize('"bruh\'" + `hello sir`')), [
        { string: `bruh'`, type: 'string', quote: '"' },
        { string: ' ', type: 'normal' },
        { string: '+', type: 'operator' },
        { string: ' ', type: 'normal' },
        { string: 'hello sir', type: 'string', quote: '`' },
    ]))
test('declaration in var name', t =>
    t.deepEqual(optimize(tokenize(`const hellofunction = 'hola'`)), [
        { string: 'const', type: 'declaration' },
        { string: ' hellofunction ', type: 'normal' },
        { string: '=', type: 'operator' },
        { string: ' ', type: 'normal' },
        { string: 'hola', type: 'string', quote: `'` },
    ]))
test('fizz buzz', t => {
    t.deepEqual(optimize(tokenize(`function hola() {\n\n\n}`)), [
        { string: 'function', type: 'declaration' },
        { string: ' hola', type: 'normal' },
        { string: '(', type: 'bracket' },
        { string: ')', type: 'bracket' },
        { string: ' ', type: 'normal' },
        { string: '{', type: 'bracket' },
        { string: `\n\n\n`, type: 'normal' },
        { string: '}', type: 'bracket' },
    ])
})

// complete lexing tests
test('empty string 2', t => t.deepEqual(lex(''), ''))
test('chicken wing 2', t =>
    t.deepEqual(
        lex('function chickenWing() {}'),
        '<font color="cornflowerblue">function</font> chickenWing<font color="red">(</font><font color="red">)</font> <font color="red">{</font><font color="red">}</font>'
    ))
test('declaration in beginning of var', t =>
    t.deepEqual(
        lex('const functionHello = `Sounds "good"`'),
        '<font color="cornflowerblue">const</font> functionHello <font color="violet">=</font> <font color="lime">`Sounds "good"`</font>'
    ))
