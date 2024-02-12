import { randomBytes } from 'crypto'
import debug from 'debug'
import jsonld, { JsonLdDocument } from 'jsonld'
import _ from 'lodash'
import { DataFactory, Quad_Graph, Term, Triple } from 'n3'
import { OperatorFunction, concatMap } from 'rxjs'
import { ChangeEvent, DeleteEvent, MoveEvent, UpdateEvent } from '../model.js'

const log = debug('yellow:adbs:graph:mapper')

export type Mapping = (document: Record<string, any>) => Promise<Triple[]>

function uniqueBlankNode(salt: string) {
  return function <T extends Term>(term: T): T {
    if (term.termType === 'BlankNode') {
      return DataFactory.blankNode(term.value.replace('_:', `${salt}`)) as T
    } else {
      return term
    }
  }
}

function uniqueBlankNodes(triples: Triple[]): Triple[] {
  const mapper = uniqueBlankNode(randomBytes(8).toString('hex'))
  return _.map(triples, ({ subject, predicate, object }) =>
    DataFactory.triple(mapper(subject), mapper(predicate), mapper(object))
  )
}

export function JSONLDMapping(path?: string): Mapping {
  if (path) {
    return FunctionMapping((document) => _.get(document, path))
  } else {
    return FunctionMapping((document) => document)
  }
}

export function FunctionMapping(objectToJsonLd: (object: Record<string, any>) => JsonLdDocument): Mapping {
  return async function (document: Record<string, any>): Promise<Triple[]> {
    return uniqueBlankNodes(await (jsonld.toRDF(objectToJsonLd(document)) as Promise<Triple[]>))
  }
}

export function AsyncFunctionMapping(
  objectToJsonLd: (object: Record<string, any>) => Promise<JsonLdDocument>
): Mapping {
  return async function (document: Record<string, any>): Promise<Triple[]> {
    return uniqueBlankNodes(await (jsonld.toRDF(await objectToJsonLd(document)) as Promise<Triple[]>))
  }
}

export class DocumentGraphMapper {
  constructor(private mappings: Mapping[]) {}
  async documentMapper(document: Record<string, any>): Promise<Triple[]> {
    return _.flatten(await Promise.all(this.mappings.map((m) => m(document))))
  }
  keyMapper(key: string): Quad_Graph {
    return DataFactory.namedNode(key)
  }

  public map(): OperatorFunction<ChangeEvent<Record<string, any>, string>, ChangeEvent<Triple[], Quad_Graph>> {
    return concatMap(async (event) => {
      log(`DocumentGraphMapper: ${event.key} ${event.kind}`)
      if (event.kind === 'update') {
        const { content, hint } = event as UpdateEvent<Record<string, any>, string>
        return {
          key: this.keyMapper(event.key),
          kind: 'update',
          content: await this.documentMapper(content),
          hint,
        } as UpdateEvent<Triple[], Quad_Graph>
      } else if (event.kind === 'delete') {
        return {
          key: this.keyMapper(event.key),
          kind: 'delete',
        } as DeleteEvent<Triple[], Quad_Graph>
      } else if (event.kind === 'move') {
        const { newKey } = event as MoveEvent<Record<string, any>, string>
        return {
          key: this.keyMapper(event.key),
          kind: 'move',
          newKey: this.keyMapper(newKey),
        } as MoveEvent<Triple[], Quad_Graph>
      }
    })
  }
}
