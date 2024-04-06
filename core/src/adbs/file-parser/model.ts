import { interfaces } from 'inversify'
import { ContentSource } from '../file-source.js'

export interface Parsed {
  document: Record<string, any>
  id: string
}

export interface Parser {
  parse(path: string, source: ContentSource): Promise<Parsed[]>
}
export const Parser: interfaces.ServiceIdentifier<Parser> = Symbol('Parser')
