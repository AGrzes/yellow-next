import debug from 'debug'
import { injectable } from 'inversify'
import { DataFactory, Quad_Graph, Store, Triple } from 'n3'
import { BehaviorSubject, Observable, PartialObserver, debounceTime, map } from 'rxjs'
import { ChangeEvent, DeleteEvent, MoveEvent, UpdateEvent } from '../model.js'

const log = debug('yellow:adbs:graph:store')

@injectable()
export class GraphStore {
  public readonly store: Store = new Store()
  private storeSubject = new BehaviorSubject<Store>(this.store)
  public get observableStore(): Observable<Store> {
    return this.storeSubject
  }
  public readonly observableUnion: Observable<Store> = this.observableStore.pipe(
    debounceTime(100),
    map(
      (store) =>
        new Store(
          store
            .getQuads(null, null, null, null)
            .map(({ subject, predicate, object }) => DataFactory.triple(subject, predicate, object))
        )
    )
  )

  constructor() {}

  public readonly observer: PartialObserver<ChangeEvent<Triple[], Quad_Graph>> = {
    next: async (event) => {
      log(`event ${event.kind} : ${event.key.value}`)
      if (event.kind === 'update') {
        const { content: triples, key: graph, hint } = event as UpdateEvent<Triple[], Quad_Graph>
        if (hint !== 'add') {
          this.store.removeQuads(this.store.getQuads(null, null, null, graph))
        }
        this.store.addQuads(
          triples.map(({ subject, predicate, object }) => DataFactory.quad(subject, predicate, object, graph))
        )
      } else if (event.kind === 'delete') {
        const { key: graph } = event as DeleteEvent<Triple[], Quad_Graph>
        this.store.removeQuads(this.store.getQuads(null, null, null, graph))
      } else if (event.kind === 'move') {
        const { key: graph, newKey: newGraph } = event as MoveEvent<Triple[], Quad_Graph>
        this.store.removeQuads(this.store.getQuads(null, null, null, newGraph))
        this.store.addQuads(
          this.store
            .getQuads(null, null, null, graph)
            .map(({ subject, predicate, object }) => DataFactory.quad(subject, predicate, object, newGraph))
        )
        this.store.removeQuads(this.store.getQuads(null, null, null, graph))
      }
      this.storeSubject.next(this.store)
    },
  }
}
