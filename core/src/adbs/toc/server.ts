import debug from 'debug'
import { Handler, Router } from 'express'
import { TocService } from './service.js'

const log = debug('yellow:adbs:toc:server')

export class TocHandler {
  public readonly handler: Handler

  constructor(
    private service: TocService,
    private router: Router
  ) {
    this.router.get('/', async (req, res) => {
      log(`get`)
      try {
        res.send(this.service.toc)
      } catch (e) {
        res.status(500).send(e)
      }
    })
    this.handler = this.router
  }
}
