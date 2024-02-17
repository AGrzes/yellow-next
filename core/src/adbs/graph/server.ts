import debug from 'debug'
import { Handler, Router } from 'express'
import jsonld from 'jsonld'
import { DataFactory, Store } from 'n3'
import { Observable } from 'rxjs'

const log = debug('yellow:adbs:graph:server')

export class GraphHandler {
  private store: Store
  public readonly handler: Handler
  constructor(
    storeSubject: Observable<Store>,
    private router: Router
  ) {
    storeSubject.subscribe((store) => {
      this.store = store
    })
    this.router.get('/', async (req, res) => {
      log(`get`)
      try {
        res.send(await jsonld.fromRDF(this.store.getQuads(null, null, null, null)))
      } catch (e) {
        res.status(500).send(e)
      }
    })
    this.router.get('/:graph', async (req, res) => {
      log(`get ${req.params.graph}`)
      try {
        res.send(await jsonld.fromRDF(this.store.getQuads(null, null, null, DataFactory.namedNode(req.params.graph))))
      } catch (e) {
        res.status(500).send(e)
      }
    })
    this.handler = this.router
  }
}
