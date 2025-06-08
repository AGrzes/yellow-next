import fsp from 'fs/promises'
import YAML from 'yaml'
import { DocumentHandler } from '../handler.js'

export class FrontmatterHandler implements DocumentHandler {
  public readonly profile = 'frontmatter'
  public readonly extensions = ['.md', '.mdx']
  public readonly contentType = 'application/json'
  constructor(
    private documentDirectory: string,
    private fs: Pick<typeof fsp, 'readFile'>
  ) {}

  async get(documentPath: string, options: any): Promise<string | null> {
    const rawContent = await this.fs.readFile(`${this.documentDirectory}/${documentPath}`, 'utf-8')
    const frontmatter = rawContent.split('---')[1]?.trim()
    const parsed = YAML.parse(frontmatter)
    return parsed ? JSON.stringify(parsed) : null
  }

  async put(documentPath: string, content: string, options: any): Promise<void> {
    // Logic to save frontmatter to the document
    console.log(`Saving frontmatter to ${documentPath}: ${content}`)
  }

  async patch(documentPath: string, content: string, options: any): Promise<void> {
    // Logic to update frontmatter in the document
    console.log(`Patching frontmatter in ${documentPath}: ${content}`)
  }
}
