import { Handler, Router } from 'express'
import { inject, injectable, interfaces, multiInject } from 'inversify'
import { extname } from 'node:path'

export interface DocumentHandler {
  profile: string
  extensions: string[]
  contentType: string
  get(documentPath: string, options: any): Promise<string | null>
  put(documentPath: string, content: string, options: any): Promise<void>
  patch(documentPath: string, content: string, options: any): Promise<void>
}

export const DocumentHandler: interfaces.ServiceIdentifier<DocumentHandler> = Symbol('DocumentHandler')

@injectable()
export class HandlerAggregator {
  public readonly handler: Handler
  constructor(
    @multiInject(DocumentHandler) private handlers: DocumentHandler[],
    @inject(Router) router: Router
  ) {
    router.use('/:documentPath(*)', async (req, res, next) => {
      const documentPath = req.params.documentPath
      const extension = extname(documentPath).toLowerCase()
      const profile = req.query.profile as string | undefined
      if (profile) {
        const handler = this.handlers.find((h) => h.profile === profile && h.extensions.includes(extension))
        if (handler) {
          if (req.method === 'GET') {
            const content = await handler.get(documentPath, {})
            res.type(handler.contentType)
            res.send(content)
          } else if (req.method === 'PUT') {
            const content = req.body as string
            await handler.put(documentPath, content, {})
            res.sendStatus(204)
          } else if (req.method === 'PATCH') {
            const content = req.body as string
            await handler.patch(documentPath, content, {})
            res.sendStatus(204)
          } else {
            next()
          }
        } else {
          next()
        }
      } else {
        next()
      }
    })

    this.handler = router
  }
}
