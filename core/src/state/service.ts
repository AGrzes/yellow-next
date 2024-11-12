interface StateRecord {}

// Inject Store instance into constructor
export class StateService {
  async getAll(model: string, entity: string) {
    return [
      { id: '1', state: 'state1' },
      { id: '2', state: 'state2' },
    ]
  }

  async get(model: string, entity: string, id: string) {
    return { id, state: 'state' }
  }

  async save(model: string, entity: string, data: any) {
    return { id: 'newId', ...data }
  }

  async update(model: string, entity: string, id: string, data: any) {
    return { id, ...data }
  }

  async delete(model: string, entity: string, id: string) {
    return { id, deleted: true }
  }
}
