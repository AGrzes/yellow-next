import { Router } from 'express'
import { AccessService } from './service.js'

export class AccessHandler {
  constructor(
    private service: AccessService,
    public readonly handler: Router
  ) {
    handler.get('/access-documents/*', async (req, res) => {
      try {
        const subPath = req.params[0]
        const files = await this.service.listFiles(subPath)
        res.send(files)
      } catch (e) {
        res.status(500).send(e)
      }
    })
  }
}
