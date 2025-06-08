import { injectable } from 'inversify'
import _ from 'lodash'
import { extname } from 'path'
import YAML from 'yaml'
import { ContentSource } from '../file-source.js'
import { Parser } from './model.js'
@injectable()
export class YamlParser implements Parser {
  constructor(private extensions: string[] = ['.yaml', '.yml']) {}
  async parse(path: string, source: ContentSource) {
    if (this.extensions.includes(extname(path))) {
      const content = await source()
      const documents = YAML.parseAllDocuments(content).map((doc) => doc.toJSON())
      return _.map(documents, (document, index) => ({ document, id: `yaml#${index}` }))
    } else {
      return []
    }
  }
}
