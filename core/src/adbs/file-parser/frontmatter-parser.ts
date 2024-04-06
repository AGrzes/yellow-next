import matter from 'gray-matter'
import { injectable } from 'inversify'
import { extname } from 'path'
import { ContentSource } from '../file-source.js'
import { Parser } from './model.js'
@injectable()
export class FrontmatterParser implements Parser {
  constructor(private extensions: string[] = ['.mdx', '.md']) {}
  async parse(path: string, source: ContentSource) {
    if (this.extensions.includes(extname(path))) {
      const content = await source()
      const frontmatter = matter(content).data
      return [{ document: frontmatter, id: 'frontmatter' }]
    } else {
      return []
    }
  }
}
