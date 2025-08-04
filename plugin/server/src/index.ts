import { ServiceIdentifier } from '@agrzes/yellow-next-plugin-core'
import { Application, Router } from 'express'

export const ROUTER: ServiceIdentifier<Router> = 'server.router'
export const SERVER: ServiceIdentifier<Application> = 'server.server'
export const SERVER_COMMAND = 'server.command'
export const SERVER_COMMAND_NAME = 'server'
export const ROUTER_FACTORY: ServiceIdentifier<typeof Router> = 'server.router-factory'
export { Router }
