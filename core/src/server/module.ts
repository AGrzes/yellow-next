import express from 'express'
import { ContainerModule } from 'inversify'
import { HttpServer } from './server.js'

export const serverModule = new ContainerModule((bind) => {
  bind(express).toConstantValue(express())
  bind(HttpServer).toSelf().inSingletonScope()
})
