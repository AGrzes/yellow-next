import { randomUUID } from 'crypto'
import debug from 'debug'
import { json, Router } from 'express'

const log = debug('yellow:ems:server')

export class EmsHandler {
  constructor(public readonly handler: Router) {
    this.handler.get('/:kind/:iri', async (req, res) => {
      log(`get`)
      try {
        res.send({ kind: req.params.kind, iri: req.params.iri })
      } catch (e) {
        res.status(500).send(e)
      }
    })
    this.handler.put('/:kind/:iri', json(), async (req, res) => {
      log(`put`)
      try {
        res.send({ ...req.body, kind: req.params.kind, iri: req.params.iri })
      } catch (e) {
        res.status(500).send(e)
      }
    })
    this.handler.post('/:kind', json(), async (req, res) => {
      log(`post`)
      try {
        res.send({ ...req.body, kind: req.params.kind, iri: `uuid:${randomUUID()}` })
      } catch (e) {
        res.status(500).send(e)
      }
    })
  }
}
