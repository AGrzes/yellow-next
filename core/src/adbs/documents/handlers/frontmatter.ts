import jsonPatch, { Operation } from 'fast-json-patch'
import fsp from 'fs/promises'
import YAML from 'yaml'
import { DocumentHandler } from '../handler.js'
const { compare } = jsonPatch

export function parseJsonPatchPath(path: string): (string | number)[] {
  return path
    .replace(/^\/+/, '')
    .split('/')
    .map((segment) => {
      const unescaped = segment.replace(/~1/g, '/').replace(/~0/g, '~')
      return /^\d+$/.test(unescaped) ? Number(unescaped) : unescaped
    })
}

export function applyYamlPatch(currentContent: any, patch: Operation[]) {
  patch.forEach((op) => {
    if (op.op === 'add' || op.op === 'replace') {
      currentContent.setIn(parseJsonPatchPath(op.path), op.value)
    } else if (op.op === 'remove') {
      currentContent.deleteIn(parseJsonPatchPath(op.path))
    } else if (op.op === 'copy') {
      const value = currentContent.getIn(parseJsonPatchPath(op.from))
      if (value !== undefined) {
        currentContent.setIn(parseJsonPatchPath(op.path), value)
      }
    } else if (op.op === 'move') {
      const value = currentContent.getIn(parseJsonPatchPath(op.from))
      if (value !== undefined) {
        currentContent.setIn(parseJsonPatchPath(op.path), value)
        currentContent.deleteIn(parseJsonPatchPath(op.from))
      }
    }
  })
}

export class FrontmatterHandler implements DocumentHandler {
  public readonly profile = 'frontmatter'
  public readonly extensions = ['.md', '.mdx']
  public readonly contentType = 'application/json'
  constructor(
    private documentDirectory: string,
    private fs: Pick<typeof fsp, 'readFile' | 'writeFile'>
  ) {}

  async get(documentPath: string, options: any): Promise<string | null> {
    const rawContent = await this.fs.readFile(`${this.documentDirectory}/${documentPath}`, 'utf-8')
    const frontmatter = rawContent.split('---')[1]
    const parsed = YAML.parse(frontmatter)
    return JSON.stringify(parsed)
  }

  async put(documentPath: string, content: string, options: any): Promise<void> {
    const rawContent = await this.fs.readFile(`${this.documentDirectory}/${documentPath}`, 'utf-8')
    const parts = rawContent.split('---')
    const frontmatter = parts[1]
    const currentContent = YAML.parseDocument(frontmatter)
    const patch = compare(currentContent.toJSON(), JSON.parse(content))
    applyYamlPatch(currentContent, patch)
    parts[1] = currentContent.toString()
    const newContent = parts.join('---')
    await this.fs.writeFile(`${this.documentDirectory}/${documentPath}`, newContent, 'utf-8')
  }

  async patch(documentPath: string, content: string, options: any): Promise<void> {
    const rawContent = await this.fs.readFile(`${this.documentDirectory}/${documentPath}`, 'utf-8')
    const parts = rawContent.split('---\n')
    const frontmatter = parts[1]
    const currentContent = YAML.parseDocument(frontmatter)
    const patch = JSON.parse(content) as Operation[]
    applyYamlPatch(currentContent, patch)
    parts[1] = currentContent.toString()
    const newContent = parts.join('---\n')
    await this.fs.writeFile(`${this.documentDirectory}/${documentPath}`, newContent, 'utf-8')
  }
}
