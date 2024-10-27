import { expect, use } from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ConfluenceClient } from '../src/client'
use(sinonChai)

const configuration = {
  baseUrl: 'https://test-site.com',
  authorization: 'Basic test-token',
}
describe('client', () => {
  describe('ConfluenceClient', () => {
    it('should create instance', () => {
      const client = new ConfluenceClient(configuration)
      expect(client).to.be.instanceOf(ConfluenceClient)
    })
    describe('get', () => {
      it('should get response', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        const response = await client.get('test')
        expect(response).to.have.property('body').to.be.deep.equals({ foo: 'bar' })
        expect(response).to.have.property('status', 200)
      })
      it('should call fetch with correct arguments', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        await client.get('test')
        expect(fetch).to.have.been.calledWith('https://test-site.com/test', {
          headers: {
            Authorization: 'Basic test-token',
            accept: 'application/json',
          },
        })
      })
    })
    describe('post', () => {
      it('should get response', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        const response = await client.post('test', { foo: 'bar' })
        expect(response).to.have.property('body').to.be.deep.equals({ foo: 'bar' })
        expect(response).to.have.property('status', 200)
      })
      it('should call fetch with correct arguments', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        await client.post('test', { foo: 'bar' })
        expect(fetch).to.have.been.calledWith('https://test-site.com/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic test-token',
            accept: 'application/json',
          },
          body: JSON.stringify({ foo: 'bar' }),
        })
      })
    })
    describe('put', () => {
      it('should get response', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        const response = await client.put('test', { foo: 'bar' })
        expect(response).to.have.property('body').to.be.deep.equals({ foo: 'bar' })
        expect(response).to.have.property('status', 200)
      })
      it('should call fetch with correct arguments', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        await client.put('test', { foo: 'bar' })
        expect(fetch).to.have.been.calledWith('https://test-site.com/test', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic test-token',
            accept: 'application/json',
          },
          body: JSON.stringify({ foo: 'bar' }),
        })
      })
    })
    describe('delete', () => {
      it('should get response', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        const response = await client.delete('test')
        expect(response).to.have.property('body').to.be.deep.equals({ foo: 'bar' })
        expect(response).to.have.property('status', 200)
      })
      it('should call fetch with correct arguments', async () => {
        const fetch = sinon.stub().resolves({
          json: () => ({ foo: 'bar' }),
          status: 200,
        })
        const client = new ConfluenceClient(configuration, fetch)
        await client.delete('test')
        expect(fetch).to.have.been.calledWith('https://test-site.com/test', {
          method: 'DELETE',
          headers: {
            Authorization: 'Basic test-token',
            accept: 'application/json',
          },
        })
      })
    })
  })
})
