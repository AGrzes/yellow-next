import fs from 'fs/promises'
import { injectable } from 'inversify'
import path from 'path'
import yaml from 'yaml'

export interface Store<T> {
  get(key: string[]): Promise<T>
  put(key: string[], value: T): Promise<void>
}

type FsForStore = Pick<typeof fs, 'readFile' | 'writeFile' | 'mkdir'>

@injectable()
export class FileStore<T> implements Store<T> {
  constructor(
    private baseDir: string,
    private fs: FsForStore = fs
  ) {}

  // Read file as YAML using base dir and key as path segments with the last one being appended with .yaml
  async get(key: string[]): Promise<T> {
    const filePath = path.join(this.baseDir, ...key) + '.yaml'
    const fileContent = await this.fs.readFile(filePath, 'utf8')
    return yaml.parse(fileContent) as T
  }

  // Write file as YAML using base dir and key as path segments with the last one being appended with .yaml
  // Create directory structure if it doesn't exist
  async put(key: string[], value: T): Promise<void> {
    const filePath = path.join(this.baseDir, ...key) + '.yaml'
    const dirPath = path.dirname(filePath)
    await this.fs.mkdir(dirPath, { recursive: true })
    const fileContent = yaml.stringify(value)
    await this.fs.writeFile(filePath, fileContent, 'utf8')
  }
}
