import { expect } from 'chai'
import 'mocha'
import Handlebars from '../src/handlebars.js'

describe('Handlebars', () => {
  it('should register snake helper', () => {
    const template = Handlebars.compile('{{snake a}}')
    expect(template({ a: 'fooBar' })).to.equal('foo_bar')
  })
  it('should register kebab helper', () => {
    const template = Handlebars.compile('{{kebab a}}')
    expect(template({ a: 'fooBar' })).to.equal('foo-bar')
  })
})
