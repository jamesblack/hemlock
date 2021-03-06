/* eslint-env jest */

const Hemlock = require('../index')
const R = require('ramda')

// validateWord : String -> Hemlock -> bool
const validateWord = R.useWith(R.pathSatisfies, [
  R.complement,
  R.split(''),
  R.prop('_trie')
])(R.isNil)

R.pipe(R.split(''))

describe('Hemlock', () => {
  it('adds words with case sensitivity', () => {
    const hemlock = new Hemlock()
    hemlock.addWord('Test')
    expect(validateWord('Test', hemlock)).toEqual(true)
  })
  it('adds words without case sensitivity', () => {
    const hemlock = new Hemlock(false)
    hemlock.addWord('Test')
    expect(validateWord('test', hemlock)).toEqual(true)
  })
  it('adding words that continue from terminations do not cause issues', () => {
    const hemlock = new Hemlock()
    hemlock.addWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(true)
    hemlock.addWord('Tests')
    expect(hemlock.checkWord('Test')).toEqual(true)
  })
  it('can check words with case sensitivity', () => {
    const hemlock = new Hemlock()
    hemlock.addWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(true)
    expect(hemlock.checkWord('test')).toEqual(false)
  })
  it('can check words without case sensitivity', () => {
    const hemlock = new Hemlock(false)
    hemlock.addWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(true)
    expect(hemlock.checkWord('test')).toEqual(true)
  })
  it('supports checking prefixes with case sensitivity', () => {
    const hemlock = new Hemlock()
    hemlock.addWord('Test')
    expect(hemlock.checkPrefix('T')).toEqual(true)
    expect(hemlock.checkPrefix('t')).toEqual(false)
    expect(hemlock.checkPrefix('Te')).toEqual(true)
    expect(hemlock.checkPrefix('te')).toEqual(false)
    expect(hemlock.checkPrefix('Tes')).toEqual(true)
    expect(hemlock.checkPrefix('tes')).toEqual(false)
    expect(hemlock.checkPrefix('Test')).toEqual(true)
    expect(hemlock.checkPrefix('test')).toEqual(false)
  })
  it('supports checking prefixes without case sensitivity', () => {
    const hemlock = new Hemlock(false)
    hemlock.addWord('Test')
    expect(hemlock.checkPrefix('T')).toEqual(true)
    expect(hemlock.checkPrefix('t')).toEqual(true)
    expect(hemlock.checkPrefix('Te')).toEqual(true)
    expect(hemlock.checkPrefix('te')).toEqual(true)
    expect(hemlock.checkPrefix('Tes')).toEqual(true)
    expect(hemlock.checkPrefix('tes')).toEqual(true)
    expect(hemlock.checkPrefix('Test')).toEqual(true)
    expect(hemlock.checkPrefix('test')).toEqual(true)
  })
  it('supports getting children with case sensitivity', () => {
    const hemlock = new Hemlock()
    hemlock.addWord('Test')
    hemlock.addWord('Te')
    hemlock.addWord('talk')
    hemlock.addWord('Town')
    hemlock.addWord('Tectonic')
    expect(hemlock.getChildren('T')).toEqual(['e', 'o'])
    expect(hemlock.getChildren('Te')).toEqual(['c', 's'])
  })
  it('supports getting children without case sensitivity', () => {
    const hemlock = new Hemlock(false)
    hemlock.addWord('Test')
    hemlock.addWord('Te')
    hemlock.addWord('talk')
    hemlock.addWord('Town')
    hemlock.addWord('Tectonic')
    expect(hemlock.getChildren('T')).toEqual(['a', 'e', 'o'])
    expect(hemlock.getChildren('Te')).toEqual(['c', 's'])
  })
  it('supports removing a word with case sensitivity', () => {
    const hemlock = new Hemlock()
    hemlock.addWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(true)
    hemlock.removeWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(false)
    expect(hemlock.checkPrefix('T')).toEqual(false)
    expect(hemlock.checkPrefix('Te')).toEqual(false)
    expect(hemlock.checkPrefix('Tes')).toEqual(false)
  })
  it('supports removing a word with case sensitivity without distrupting branches', () => {
    const hemlock = new Hemlock()
    hemlock.addWord('Test')
    hemlock.addWord('Tests')
    expect(hemlock.checkWord('Test')).toEqual(true)
    expect(hemlock.checkWord('Tests')).toEqual(true)
    hemlock.removeWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(false)
    expect(hemlock.checkWord('Tests')).toEqual(true)
  })
  it('supports removing a word without case sensitivity', () => {
    const hemlock = new Hemlock(false)
    hemlock.addWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(true)
    hemlock.removeWord('Test')
    expect(hemlock.checkWord('Test')).toEqual(false)
    expect(hemlock.checkPrefix('t')).toEqual(false)
    expect(hemlock.checkPrefix('Te')).toEqual(false)
    expect(hemlock.checkPrefix('TeS')).toEqual(false)
  })
  it('supports removing a word without case sensitivity without distrupting branches', () => {
    const hemlock = new Hemlock(false)
    hemlock.addWord('Test')
    hemlock.addWord('tests')
    expect(hemlock.checkWord('Test')).toEqual(true)
    expect(hemlock.checkWord('TestS')).toEqual(true)
    hemlock.removeWord('test')
    expect(hemlock.checkWord('Test')).toEqual(false)
    expect(hemlock.checkWord('TestS')).toEqual(true)
  })
  it('does not try to remove words that do not exist', () => {
    const hemlock = new Hemlock(false)
    hemlock.addWord('Tests')
    expect(() => hemlock.removeWord('test')).toThrowError('No such word: test')
    expect(hemlock.checkWord('tests')).toEqual(true)
  })
  it('does not fetch children if there is has no children', () => {
    const hemlock = new Hemlock()
    expect(() => hemlock.getChildren('Test')).toThrowError(
      'No such prefix: Test'
    )
  })
})
