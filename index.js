import React from 'react'

const operators = ['+', '-', '?', '*', '%', '/', '<', '>', '=', '!', ':']
const brackets = ['(', ')', '[', ']', '{', '}']
const quotes = ['"', `'`, '`']
const declarations = [
    'function',
    'var',
    'let',
    'if',
    'else',
    'switch',
    'case',
    'break',
    'const',
    'return',
    'import',
    'from',
    'export',
    'default',
    'continue',
    'class',
]

export function color(string, color, { react }) {
    if (!react) return `<font color="${color}">${string}</font>`
    return <font style={{ color }}>{string}</font>
}

function isNumber(num) {
    return !Number.isNaN(Number(num)) && num !== ' ' && num !== '\n'
}

export function highlight(tokens, { react, primary, secondary }) {
    let code = ''

    tokens.forEach(({ string, type, quote }) => {
        switch (type) {
            case 'declaration':
                code += color(string, primary, { react })
                break
            case 'string':
                code += color(quote + string + quote, secondary, { react })
                break
            case 'operator':
                code += color(string, 'grey', { react })
                break
            case 'number':
                code += color(string, secondary, { react })
                break
            case 'bracket':
            case 'normal':
                code += string
                break
        }
    })

    return code
}

export function optimize(tokens, lastToken = {}) {
    if (tokens.length <= 1) return tokens

    if (lastToken.type === 'normal' && tokens[0].type === 'normal') {
        lastToken.string += tokens[0].string
        return optimize(tokens.slice(1), lastToken)
    }

    return [tokens[0]].concat(optimize(tokens.slice(1), tokens[0]))
}

export function tokenize(code) {
    code = code.trim()
    let tokens = []

    for (let i = 0; i < code.length; ) {
        const char = code[i]

        if (quotes.includes(char)) {
            const quote = char

            let j
            for (j = i + 1; j < code.length; j++) if (code[j] === quote) break

            tokens.push({
                string: code.substring(i + 1, j),
                type: 'string',
                quote,
            })
            i += j - i + 1
            continue
        }
        let foundDeclaration
        declarations.find(declaration => {
            const prefixes = brackets.concat([' ', '\n', ';'])

            const snippet = code.substring(i, i + declaration.length)
            if (
                snippet === declaration &&
                (prefixes.includes(code[i - 1]) || i === 0) &&
                prefixes.includes(code[i + declaration.length])
            ) {
                tokens.push({ string: declaration, type: 'declaration' })
                i += declaration.length
                foundDeclaration = true
                return true
            }

            return false
        })
        if (foundDeclaration) continue
        if (isNumber(char)) {
            tokens.push({ string: char, type: 'number' })
            i++
            continue
        }
        if (operators.includes(char)) {
            tokens.push({ string: char, type: 'operator' })
            i++
            continue
        }
        if (brackets.includes(char)) {
            tokens.push({ string: char, type: 'bracket' })
            i++
            continue
        }
        tokens.push({ string: char, type: 'normal' })
        i++
    }

    return tokens
}

export function lex(
    code,
    { react = false, primary = 'cornflowerblue', secondary = 'orange' }
) {
    return highlight(optimize(tokenize(code)), { react, primary, secondary })
}
