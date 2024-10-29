import { expect, use } from 'chai'
import lodash from 'lodash'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ConfluenceClient } from '../src/client'
import { Confluence } from '../src/index.js'
const { isEqual } = lodash
use(sinonChai)

function matchRelativeUrl(path: string, query: Record<string, string | string[]>) {
  return sinon.match((v: string) => {
    const search = new URLSearchParams(v.split('?')[1])
    return (
      v.startsWith(path) &&
      Object.entries(query).every(([key, value]) =>
        Array.isArray(value)
          ? isEqual(search.getAll(key).toSorted(), value.toSorted())
          : search.getAll(key).includes(value)
      )
    )
  })
}

describe('confluence', () => {
  describe('Confluence', () => {
    it('should create instance', () => {
      const client = sinon.createStubInstance(ConfluenceClient)
      const confluence = new Confluence(client)
      expect(confluence).to.be.instanceOf(Confluence)
    })
    describe('spaceId', () => {
      it('should get space id', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({ body: { id: 123 }, status: 200 })
        const spaceId = await confluence.spaceId('test-space')
        expect(spaceId).to.be.equal(123)
        expect(client.get).to.have.been.calledWith('wiki/rest/api/space/test-space')
      })
    })
    describe('page', () => {
      it('should get draft page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [] },
          status: 200,
        })
        client.get.onSecondCall().resolves({
          body: { results: [{ id: 123, version: { number: 1 }, status: 'draft' }] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.deep.equal({ id: 123, version: 1, title: 'test-title', status: 'draft' })
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            expand: ['version'],
          })
        )
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            status: 'draft',
            expand: ['version'],
          })
        )
      })
      it('should get published page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [{ id: 123, version: { number: 1 }, status: 'current' }] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.deep.equal({ id: 123, version: 1, title: 'test-title', status: 'current' })
        expect(client.get).to.have.been.calledOnceWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            expand: ['version'],
          })
        )
      })
      it('should return undefined for non existing page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({
          body: { results: [] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.undefined
        expect(client.get).to.have.been.calledTwice
      })
      it('should return body if asked for', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: {
            results: [
              {
                id: 123,
                version: { number: 1 },
                status: 'current',
                body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) }, storage: { value: 'storage' } },
              },
            ],
          },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title', true)
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'current',
          content: { foo: 'bar' },
          storage: 'storage',
        })
        expect(client.get).to.have.been.calledOnceWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            expand: 'version,body.atlas_doc_format,body.storage',
          })
        )
      })
      it('should return body of published page if asked for', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [] },
          status: 200,
        })
        client.get.onSecondCall().resolves({
          body: {
            results: [
              {
                id: 123,
                version: { number: 1 },
                status: 'draft',
                body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) }, storage: { value: 'storage' } },
              },
            ],
          },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title', true)
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
          storage: 'storage',
        })
        expect(client.get).to.have.been.calledTwice
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            status: 'draft',
            expand: 'version,body.atlas_doc_format,body.storage',
          })
        )
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            expand: 'version,body.atlas_doc_format,body.storage',
          })
        )
      })
    })
    describe('createPage', () => {
      it('should create page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({
          body: { id: 321 },
          status: 200,
        })
        client.post.resolves({
          body: {
            id: 123,
            version: { number: 1 },
            status: 'draft',
            title: 'test-title',
            body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
          },
          status: 200,
        })
        const page = await confluence.createPage('test-space', {
          content: { foo: 'bar' },
          title: 'test-title',
          status: 'draft',
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(client.post).to.have.been.calledOnceWith('wiki/api/v2/pages', {
          spaceId: 321,
          status: 'draft',
          title: 'test-title',
          body: {
            value: JSON.stringify({ foo: 'bar' }),
            representation: 'atlas_doc_format',
          },
        })
      })
      it('should create page with storage', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({
          body: { id: 321 },
          status: 200,
        })
        client.post.resolves({
          body: {
            id: 123,
            version: { number: 1 },
            status: 'draft',
            title: 'test-title',
            body: { storage: { value: 'storage' } },
          },
          status: 200,
        })
        const page = await confluence.createPage('test-space', {
          storage: 'storage',
          title: 'test-title',
          status: 'draft',
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          storage: 'storage',
        })
        expect(client.post).to.have.been.calledOnceWith('wiki/api/v2/pages', {
          spaceId: 321,
          status: 'draft',
          title: 'test-title',
          body: {
            value: 'storage',
            representation: 'storage',
          },
        })
      })
      it('should set parent page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [{ id: 333 }] },
          status: 200,
        })
        client.get.onSecondCall().resolves({
          body: { id: 321 },
          status: 200,
        })
        client.post.resolves({
          body: {
            id: 123,
            version: { number: 1 },
            status: 'draft',
            title: 'test-title',
            parentId: 333,
            body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
          },
          status: 200,
        })
        const page = await confluence.createPage('test-space', {
          content: { foo: 'bar' },
          title: 'test-title',
          status: 'draft',
          parent: 'parent-title',
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          parentId: 333,
          content: { foo: 'bar' },
        })
        expect(client.post).to.have.been.calledOnceWith('wiki/api/v2/pages', {
          spaceId: 321,
          status: 'draft',
          title: 'test-title',
          parentId: 333,
          body: {
            value: JSON.stringify({ foo: 'bar' }),
            representation: 'atlas_doc_format',
          },
        })
      })
    })
    describe('updatePage', () => {
      it('should update page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.put.resolves({
          body: {
            id: 123,
            version: { number: 2 },
            status: 'draft',
            title: 'test-title',
            body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
          },
          status: 200,
        })
        const page = await confluence.updatePage('test-space', {
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 2,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(client.put).to.have.been.calledOnceWith('wiki/api/v2/pages/123', {
          id: 123,
          type: 'page',
          status: 'draft',
          title: 'test-title',
          body: {
            value: JSON.stringify({ foo: 'bar' }),
            representation: 'atlas_doc_format',
          },
          version: {
            number: 1,
          },
        })
      })
      it('should update page with storage', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.put.resolves({
          body: {
            id: 123,
            version: { number: 2 },
            status: 'draft',
            title: 'test-title',
            body: { storage: { value: 'storage' } },
          },
          status: 200,
        })
        const page = await confluence.updatePage('test-space', {
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          storage: 'storage',
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 2,
          title: 'test-title',
          status: 'draft',
          storage: 'storage',
        })
        expect(client.put).to.have.been.calledOnceWith('wiki/api/v2/pages/123', {
          id: 123,
          type: 'page',
          status: 'draft',
          title: 'test-title',
          body: {
            value: 'storage',
            representation: 'storage',
          },
          version: {
            number: 1,
          },
        })
      })
      it('should set parent page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [{ id: 333 }] },
          status: 200,
        })
        client.get.onSecondCall().resolves({
          body: { id: 321 },
          status: 200,
        })
        client.put.resolves({
          body: {
            id: 123,
            version: { number: 2 },
            status: 'draft',
            title: 'test-title',
            parentId: 333,
            body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
          },
          status: 200,
        })
        const page = await confluence.updatePage('test-space', {
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
          parent: 'parent-title',
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 2,
          title: 'test-title',
          status: 'draft',
          parentId: 333,
          content: { foo: 'bar' },
        })
        expect(client.put).to.have.been.calledOnceWith('wiki/api/v2/pages/123', {
          id: 123,
          type: 'page',
          status: 'draft',
          title: 'test-title',
          parentId: 333,
          body: {
            value: JSON.stringify({ foo: 'bar' }),
            representation: 'atlas_doc_format',
          },
          version: {
            number: 1,
          },
        })
      })
      it('should increment version for published page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.put.resolves({
          body: {
            id: 123,
            version: { number: 2 },
            status: 'current',
            title: 'test-title',
            body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
          },
          status: 200,
        })
        const page = await confluence.updatePage('test-space', {
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'current',
          content: { foo: 'bar' },
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 2,
          title: 'test-title',
          status: 'current',
          content: { foo: 'bar' },
        })
        expect(client.put).to.have.been.calledOnceWith('wiki/api/v2/pages/123', {
          id: 123,
          type: 'page',
          status: 'current',
          title: 'test-title',
          body: {
            value: JSON.stringify({ foo: 'bar' }),
            representation: 'atlas_doc_format',
          },
          version: {
            number: 2,
          },
        })
      })
    })
    describe('search', () => {
      it('should search', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({
          body: { results: [{ id: 123, title: 'test-title', version: { number: 123 }, status: 'draft' }] },
          status: 200,
        })
        const pages = await confluence.search('cql')
        expect(pages).to.be.deep.equal([{ id: 123, title: 'test-title', version: 123, status: 'draft' }])
        expect(client.get).to.have.been.calledOnceWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            cql: 'type=page and cql',
            expand: 'version',
          })
        )
      })
    })
  })
})
