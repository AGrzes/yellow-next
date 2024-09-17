import { injectable } from 'inversify'
import _ from 'lodash'
import { extname, join } from 'path'
import { cwd } from 'process'
import { ContentSource } from '../file-source.js'
import { Parser } from './model.js'
@injectable()
export class ScriptParser implements Parser {
  constructor(private extensions: string[] = ['.js', '.mjs', '.ts', '.mts']) {}
  async parse(path: string, source: ContentSource) {
    if (this.extensions.includes(extname(path))) {
      const content = (await import(join(cwd(), path) + `?t=${_.now()}`)).default
      if (_.isArray(content)) {
        return _.map(content, (document, index) => ({ document, id: `js#${index}` }))
      } else if (_.isFunction(content)) {
        return [{ document: await content(), id: 'js#0' }]
      } else {
        return [{ document: content, id: 'js#0' }]
      }
    } else {
      return []
    }
  }
}
