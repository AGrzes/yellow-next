import 'mocha'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { firstValueFrom, of, toArray } from 'rxjs'
import { stub } from 'sinon'
import sinonChai from 'sinon-chai'
import { FileParser } from '../../../src/adbs/file-parser/file-parser.js'
const expect = chai.use(sinonChai).use(chaiAsPromised).expect

describe('parse', () => {
  it('should handle updates', async () => {
    const parser = { parse: stub().resolves([{ document: { foo: 'bar' }, id: 'yaml#0' }]) }
    const parsed = await firstValueFrom(
      of({ key: 'path', kind: 'update', hint: 'add' }).pipe(new FileParser([parser]).parse())
    )
    expect(parsed).to.deep.equal({ key: 'path#yaml#0', kind: 'update', content: { foo: 'bar' }, hint: 'add' })
  })

  it('should handle deletes', async () => {
    const parser = { parse: stub().resolves([]) }
    const parsed = await firstValueFrom(of({ key: 'path', kind: 'delete' }).pipe(new FileParser([parser]).parse()))
    expect(parsed).to.deep.equal({ key: 'path', kind: 'delete' })
  })

  it('should handle moves', async () => {
    const parser = { parse: stub().resolves([]) }
    const parsed = await firstValueFrom(
      of({ key: 'path', kind: 'move', newKey: 'newPath' }).pipe(new FileParser([parser]).parse())
    )
    expect(parsed).to.deep.equal({ key: 'path', kind: 'move', newKey: 'newPath' })
  })

  it('should handle errors', async () => {
    const parser = { parse: stub().rejects(new Error('error')) }
    const parsed = await firstValueFrom(
      of({ key: 'path', kind: 'update', hint: 'add' }).pipe(new FileParser([parser]).parse(), toArray())
    )
    expect(parsed).to.deep.equal([])
  })

  it('should handle multiple parsers', async () => {
    const parser1 = { parse: stub().resolves([{ document: { foo: 'bar' }, id: 'yaml#0' }]) }
    const parser2 = { parse: stub().resolves([{ document: { bar: 'baz' }, id: 'yaml#1' }]) }
    const parsed = await firstValueFrom(
      of({ key: 'path', kind: 'update', hint: 'add' }).pipe(new FileParser([parser1, parser2]).parse(), toArray())
    )
    expect(parsed).to.deep.equal([
      { key: 'path#yaml#0', kind: 'update', content: { foo: 'bar' }, hint: 'add' },
      { key: 'path#yaml#1', kind: 'update', content: { bar: 'baz' }, hint: 'add' },
    ])
  })
})
