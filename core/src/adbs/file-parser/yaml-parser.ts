import { inject, injectable } from 'inversify'
import yaml from 'js-yaml'
import _ from 'lodash'
import { extname } from 'path'
import { Parser, Read } from './model.js'
@injectable()
export class YamlParser implements Parser {
  constructor(
    @inject(Read) private read: (path: string) => Promise<string>,
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
