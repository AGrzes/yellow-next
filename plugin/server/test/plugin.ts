import {
  ApplicationContext,
  CONTEXT,
  ServiceRegistration,
  ServiceRequest,
  ServiceSelector,
} from '@agrzes/yellow-next-plugin-core'
import * as chai from 'chai'
import { Application } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { SERVER } from '../src/index.js'
import plugin from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    describe('server', () => {
      let registration: ServiceRegistration<Application, readonly [ServiceSelector<ApplicationContext>]>
      before(() => {
        plugin({
          manifest: {
            base: 'base',
            manifestVersion: '1',
          },
          registry: {
            register: (options) => {
              if (options.identifier === SERVER) {
                registration = options as unknown as ServiceRegistration<
                  Application,
                  readonly [ServiceSelector<ApplicationContext>]
                >
              }
            },
          },
        })
      })
      it('should register server', () => {
        expect(registration).to.be.an('object')
      })
      it('should declare dependencies', () => {
        expect(registration.dependencies).to.be.deep.equal([ServiceRequest.named(CONTEXT, null)])
      })
      it('should not have provided services', () => {
        expect(registration.provided).to.be.undefined
      })
      it('should not have qualifier', () => {
        expect(registration.qualifier).to.be.undefined
      })
      it('should register a server', async () => {
        expect(registration.factory).to.be.a('function')
        const context = {
          get: sinon.stub().resolves([]),
        } as unknown as ApplicationContext
        const app = await registration.factory([context])
        expect(app).to.be.a('function')
      })
    })
  })
})
