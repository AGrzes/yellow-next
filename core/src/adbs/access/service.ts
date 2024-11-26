import fsp from 'fs/promises'
import { join } from 'path'

export interface DocumentEntry {
  name: string
  path: string
  formats: string[]
}

export class AccessService {
  constructor(
    private documentDirectory: string = 'documents',
    private fs: Pick<typeof fsp, 'readdir'> = fsp
  ) {}

  public async listFiles(subPath: string = ''): Promise<DocumentEntry[]> {
    const directory = join(this.documentDirectory, subPath)
    const files = await this.fs.readdir(directory)
    return files.map((file) => ({
      name: file,
      path: join(subPath, file),
      formats: [],
    }))
  }
}
