export interface Parsed {
  document: Record<string, any>
  id: string
}

export interface Parser {
  parse(path: string): Promise<Parsed[]>
}
