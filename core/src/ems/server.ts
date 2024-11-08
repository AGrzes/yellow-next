import debug from 'debug'
import { json, Router } from 'express'
import { EmsService } from './service'

const log = debug('yellow:ems:server')

export class EmsHandler {
  constructor(
    public readonly handler: Router,
    private service: EmsService
  ) {
    this.handler.get('/:kind/:iri', async (req, res) => {
      log(`get`)
      try {
        const result = await this.service.get(req.params.kind, req.params.iri)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })
    this.handler.put('/:kind/:iri', json(), async (req, res) => {
      log(`put`)
      try {
        const result = await this.service.put(req.params.kind, req.params.iri, req.body)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })
    this.handler.post('/:kind', json(), async (req, res) => {
      log(`post`)
      try {
        const result = await this.service.post(req.params.kind, req.body)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })
  }
}
