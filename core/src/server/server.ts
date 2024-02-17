import express from 'express'
import { inject, injectable } from 'inversify'

interface HandlerRegistration {
  path?: string
  handler: express.RequestHandler
  priority?: number
}

@injectable()
export class HttpServer {
  readonly handlers: HandlerRegistration[] = []

  constructor(@inject(express) private readonly express: express.Express) {}

  public register(handler: HandlerRegistration) {
    this.handlers.push({ priority: 500, path: '/', ...handler })
  }

  public async start(port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000) {
    this.handlers.sort((a, b) => a.priority - b.priority)
    this.handlers.forEach((handler) => this.express.use(handler.path, handler.handler))

    return new Promise<void>((resolve) => this.express.listen(port, () => resolve()))
  }
}
