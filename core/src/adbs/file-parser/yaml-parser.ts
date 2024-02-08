import yaml from 'js-yaml'
import _ from 'lodash'
import { extname } from 'path'
import { Parser } from './model.js'

export class YamlParser implements Parser {
  constructor(
    private read: (path: string) => Promise<string>,
    private extensions: string[] = ['.yaml', '.yml']
  ) {}
  async parse(path: string) {
    if (this.extensions.includes(extname(path))) {
      const content = await this.read(path)
      const documents = yaml.loadAll(content)
      return _.map(documents, (document, index) => ({ document, id: `yaml#${index}` }))
    } else {
      return []
    }
  }
}
