import { randomUUID } from 'crypto'

export class EmsService {
  async get(kind: string, iri: string) {
    return { kind, iri }
  }

  async put(kind: string, iri: string, data: any) {
    return { ...data, kind, iri }
  }

  async post(kind: string, data: any) {
    return { ...data, kind, iri: `uuid:${randomUUID()}` }
  }
}
