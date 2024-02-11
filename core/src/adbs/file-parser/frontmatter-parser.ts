import matter from 'gray-matter'
import { inject, injectable } from 'inversify'
import { extname } from 'path'
import { Read } from './model.js'
@injectable()
export class FrontmatterParser {
  constructor(
    @inject(Read) private read: (path: string) => Promise<string>,
    private extensions: string[] = ['.mdx']
  ) {}
  async parse(path: string) {
    if (this.extensions.includes(extname(path))) {
      const content = await this.read(path)
      const frontmatter = matter(content).data
      return [{ document: frontmatter, id: 'frontmatter' }]
    } else {
      return []
    }
  }
}
