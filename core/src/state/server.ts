import debug from 'debug'
import { json, Router } from 'express'
import { StateService } from './service'

const log = debug('yellow:state:server')

export class StateHandler {
  constructor(
    public readonly handler: Router,
    private service: StateService
  ) {
    this.handler.get('/:model/:entity', async (req, res) => {
      log(`get all states for entity`)
      try {
        const result = await this.service.getAll(req.params.model, req.params.entity)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.get('/:model/:entity/:id', async (req, res) => {
      log(`get specific state`)
      try {
        const result = await this.service.get(req.params.model, req.params.entity, req.params.id)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.post('/:model/:entity', json(), async (req, res) => {
      log(`save new state`)
      try {
        const result = await this.service.save(req.params.model, req.params.entity, req.body)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.put('/:model/:entity/:id', json(), async (req, res) => {
      log(`update specific state`)
      try {
        const result = await this.service.update(req.params.model, req.params.entity, req.params.id, req.body)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.delete('/:model/:entity/:id', async (req, res) => {
      log(`delete specific state`)
      try {
        const result = await this.service.delete(req.params.model, req.params.entity, req.params.id)
        res.send(result)
      } catch (e) {
        res.status(500).send(e)
      }
    })
  }
}
