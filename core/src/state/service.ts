import { ClassOptions, PropertyOptions } from '@agrzes/yellow-next-shared/dynamic/model'
import { injectable } from 'inversify'
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

interface StateModel {
  name: string
  stateClass: ClassOptions
  linkProperty: PropertyOptions
  orderProperty: PropertyOptions
  stateProperty: PropertyOptions
}

export interface StateModelService {
  has(name: string): boolean
  get(name: string): StateModel
}

@injectable()
export class StateService<T = any> {
  constructor(
    private store: Store<StateRecord<T>>,
    private modelService: StateModelService
  ) {}

  private getKey(model: string, entity: string): string[] {
    return [model, entity]
  }

  private initializeRecord(modelName: string, iri: string): StateRecord<T> {
    const model = this.modelService.get(modelName)
    return {
      graph: {
        '@context': {
          iri: '@id',
          a: '@type',
          State: {
            '@id': model.stateClass.iri,
          },
        },
        '@graph': { iri, state: [] },
      },
    }
  }

  private validateModel(model: string) {
    if (!this.modelService.has(model)) {
      throw new Error(`Model ${model} is not known to the model service`)
    }
  }

  async getAll(model: string, entity: string) {
    this.validateModel(model)
    const key = this.getKey(model, entity)
    const record = await this.store.get(key)
    return record?.graph?.['@graph']?.state || []
  }

  async get(model: string, entity: string, id: string) {
    this.validateModel(model)
    const states = await this.getAll(model, entity)
    return states.find((state) => state.iri === id)
  }

  async save(model: string, entity: string, data: any) {
    this.validateModel(model)
    const key = this.getKey(model, entity)
    const record = (await this.store.get(key)) || this.initializeRecord(model, entity)
    const newState = { iri: `newId`, ...data }
    record.graph['@graph'].state.push(newState)
    await this.store.put(key, record)
    return newState
  }

  async update(model: string, entity: string, id: string, data: any) {
    this.validateModel(model)
    const key = this.getKey(model, entity)
    const record = await this.store.get(key)
    const state = record.graph['@graph'].state.find((state) => state.iri === id)
    Object.assign(state, data)
    await this.store.put(key, record)
    return state
  }

  async delete(model: string, entity: string, id: string) {
    this.validateModel(model)
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
