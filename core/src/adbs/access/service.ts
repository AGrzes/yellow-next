import { readdir } from 'fs/promises'
import { injectable } from 'inversify'
import { join } from 'path'

@injectable()
export class AccessService {
  constructor(private documentDirectory: string = 'documents') {}

  public async listFiles(subPath: string = ''): Promise<string[]> {
    const directory = join(this.documentDirectory, subPath)
    const files = await readdir(directory)
    return files.map((file) => join(directory, file))
  }
}
