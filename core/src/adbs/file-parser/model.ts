import { interfaces } from 'inversify'

export interface Parsed {
  document: Record<string, any>
  id: string
}

export interface Parser {
  parse(path: string): Promise<Parsed[]>
}
export const Parser: interfaces.ServiceIdentifier<Parser> = Symbol('Parser')

export const Read: interfaces.ServiceIdentifier<(path: string) => Promise<string>> = Symbol('Read')
