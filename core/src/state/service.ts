import { Store } from './store.js'

interface State {
  date: string
  iri: string
}

interface StateRecord<T> {
  graph: {
    '@context': {}
    '@graph': {
      iri: string
      state: Array<T & State>
    }
  }
}

export class StateService<T = any> {
  constructor(private store: Store<StateRecord<T>>) {}

  private getKey(model: string, entity: string): string[] {
    return [model, entity]
  }

  private initializeRecord(model: string): StateRecord<T> {
    return { graph: { '@context': {}, '@graph': { iri: model, state: [] } } }
  }

  async getAll(model: string, entity: string) {
    const key = this.getKey(model, entity)
    const record = await this.store.get(key)
    return record.graph['@graph'].state
  }

  async get(model: string, entity: string, id: string) {
    const states = await this.getAll(model, entity)
    return states.find((state) => state.iri === id)
  }

  async save(model: string, entity: string, data: any) {
    const key = this.getKey(model, entity)
    const record = (await this.store.get(key)) || this.initializeRecord(model)
    const newState = { iri: `newId`, ...data }
    record.graph['@graph'].state.push(newState)
    await this.store.put(key, record)
    return newState
  }

  async update(model: string, entity: string, id: string, data: any) {
    const key = this.getKey(model, entity)
    const record = await this.store.get(key)
    const state = record.graph['@graph'].state.find((state) => state.iri === id)
    Object.assign(state, data)
    await this.store.put(key, record)
    return state
  }

  async delete(model: string, entity: string, id: string) {
    const key = this.getKey(model, entity)
    const record = await this.store.get(key)
    if (!record) {
      return { id, deleted: false }
    }
    const index = record.graph['@graph'].state.findIndex((state) => state.iri === id)
    if (index !== -1) {
      record.graph['@graph'].state.splice(index, 1)
      await this.store.put(key, record)
      return { id, deleted: true }
    }
    return { id, deleted: false }
  }
}
