import { expect } from 'chai'
import 'mocha'
import { configurationFromEnv } from '../src/configuration'

describe('configuration', () => {
  describe('configurationFromEnv', () => {
    it('should return default configuration', () => {
      process.env.CONFLUENCE_SITE = 'https://test-site.com'
      process.env.CONFLUENCE_EMAIL = 'test-email'
      process.env.CONFLUENCE_API_TOKEN = 'test-token'
      const configuration = configurationFromEnv()
      expect(configuration).to.have.property('baseUrl', 'https://test-site.com')
      expect(configuration).to.have.property(
        'authorization',
        `Basic ${Buffer.from('test-email:test-token').toString('base64')}`
      )
    })
    it('should return instance configuration', () => {
      process.env.CONFLUENCE_TEST_SITE = 'https://test-site.com'
      process.env.CONFLUENCE_TEST_EMAIL = 'test-email'
      process.env.CONFLUENCE_TEST_API_TOKEN = 'test-token'
      const configuration = configurationFromEnv('TEST')
      expect(configuration).to.have.property('baseUrl', 'https://test-site.com')
      expect(configuration).to.have.property(
        'authorization',
        `Basic ${Buffer.from('test-email:test-token').toString('base64')}`
      )
    })
  })
})
