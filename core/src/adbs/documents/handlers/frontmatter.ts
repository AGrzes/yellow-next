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

export class Frontmatter {
  private rawContent: string
  private parts: string[] = []
  constructor(
    private filePath: string,
    private fs: Pick<typeof fsp, 'readFile' | 'writeFile'>
  ) {}

  async read(): Promise<void> {
    try {
      this.rawContent = await this.fs.readFile(this.filePath, 'utf-8')
      this.parts = this.rawContent.split(/^---\s*$/m)
    } catch (err: any) {
      if (err && (err.code === 'ENOENT' || err.code === 'FileNotFound')) {
        this.rawContent = null
        this.parts = ['---', '', '---']
      } else {
        throw err
      }
    }
  }
  get document() {
    if (this.parts.length >= 3) {
      const frontmatter = this.parts[1]
      if (frontmatter.trim()) {
        const parsed = YAML.parseDocument(frontmatter)
        if (parsed?.errors.length > 0) {
          throw new Error(`YAML parsing errors: ${parsed.errors.map((e) => e.message).join(', ')}`)
        }
        return parsed
      }
    }
    return null
  }
  set document(value: any) {
    if (this.parts.length >= 3) {
      this.parts[1] = value.toString()
      this.rawContent = this.parts.join('---\n')
    }
  }
  async write(): Promise<void> {
    if (this.rawContent) {
      await this.fs.writeFile(this.filePath, this.rawContent, 'utf-8')
    } else {
      throw new Error('No content to write')
    }
  }
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
    const frontmatter = new Frontmatter(`${this.documentDirectory}/${documentPath}`, this.fs)
    await frontmatter.read()
    const document = frontmatter.document
    return document ? JSON.stringify(document.toJSON()) : null
  }

  async put(documentPath: string, content: string, options: any): Promise<void> {
    const frontmatter = new Frontmatter(`${this.documentDirectory}/${documentPath}`, this.fs)
    await frontmatter.read()
    const currentContent = frontmatter.document
    const patch = compare(currentContent, JSON.parse(content))
    applyYamlPatch(currentContent, patch)
    frontmatter.document = currentContent
    await frontmatter.write()
  }

  async patch(documentPath: string, content: string, options: any): Promise<void> {
    const frontmatter = new Frontmatter(`${this.documentDirectory}/${documentPath}`, this.fs)
    await frontmatter.read()
    const currentContent = frontmatter.document
    const patch = JSON.parse(content) as Operation[]
    applyYamlPatch(currentContent, patch)
    frontmatter.document = currentContent
    await frontmatter.write()
  }
}
