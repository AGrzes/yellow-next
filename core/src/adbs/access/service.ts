import fsp from 'fs/promises'
import { join } from 'path'

export interface Entry {
  name: string
  path: string
  isFolder: boolean
}

export interface DocumentEntry extends Entry {
  formats: string[]
  isFolder: false
}

export interface FolderEntry extends Entry {
  isFolder: true
}

export class AccessService {
  constructor(
    private documentDirectory: string = 'documents',
    private fs: Pick<typeof fsp, 'readdir' | 'stat'> = fsp
  ) {}

  public async listFiles(subPath: string = ''): Promise<Entry[]> {
    const directory = join(this.documentDirectory, subPath)
    const files = await this.fs.readdir(directory)
    return Promise.all(
      files.map(async (file) => {
        const filePath = join(subPath, file)
        const stats = await this.fs.stat(join(this.documentDirectory, filePath))
        return {
          name: file,
          path: filePath,
          ...(stats.isDirectory() ? { isFolder: true } : { formats: [], isFolder: false }),
        }
      })
    )
  }
}
