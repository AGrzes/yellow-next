import debug from 'debug'
import { json, Router } from 'express'

const log = debug('yellow:state:server')

export class StateHandler {
  constructor(public readonly handler: Router) {
    this.handler.get('/:model/:entity', async (req, res) => {
      log(`get all states for entity`)
      try {
        // Mock implementation
        res.send([
          { id: '1', state: 'state1' },
          { id: '2', state: 'state2' },
        ])
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.get('/:model/:entity/:id', async (req, res) => {
      log(`get specific state`)
      try {
        // Mock implementation
        res.send({ id: req.params.id, state: 'state' })
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.post('/:model/:entity', json(), async (req, res) => {
      log(`save new state`)
      try {
        // Mock implementation
        res.send({ id: 'newId', ...req.body })
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.put('/:model/:entity/:id', json(), async (req, res) => {
      log(`update specific state`)
      try {
        // Mock implementation
        res.send({ id: req.params.id, ...req.body })
      } catch (e) {
        res.status(500).send(e)
      }
    })

    this.handler.delete('/:model/:entity/:id', async (req, res) => {
      log(`delete specific state`)
      try {
        // Mock implementation
        res.send({ id: req.params.id, deleted: true })
      } catch (e) {
        res.status(500).send(e)
      }
    })
  }
}
