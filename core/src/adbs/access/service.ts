import { readdir } from 'fs/promises'
import { injectable } from 'inversify'
import { join } from 'path'

export interface DocumentEntry {
  name: string
  path: string
  formats: string[]
}

@injectable()
export class AccessService {
  constructor(private documentDirectory: string = 'documents') {}

  public async listFiles(subPath: string = ''): Promise<DocumentEntry[]> {
    const directory = join(this.documentDirectory, subPath)
    const files = await readdir(directory)
    return files.map((file) => ({
      name: file,
      path: join(directory, file),
      formats: [],
    }))
  }
}
