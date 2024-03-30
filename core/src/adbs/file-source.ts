import { watch } from 'chokidar'
import { readFile } from 'fs/promises'
import { inject, injectable } from 'inversify'
import { join } from 'path'
import { Observable, Subject } from 'rxjs'
import { ChangeEvent, UpdateEvent } from './model.js'

export type ContentSource = () => Promise<string>

@injectable()
export class FileSource {
  constructor(
    @inject(watch) private createWatcher: typeof watch,
    @inject(readFile) private read: typeof readFile
  ) {}

  observe(documentDirectory: string): Observable<ChangeEvent<ContentSource, string>> {
    const subject = new Subject<ChangeEvent<ContentSource, string>>()
    const watcher = this.createWatcher('.', { cwd: documentDirectory })
    const content = (path: string) => async () => this.read(join(documentDirectory, path), 'utf8')
    watcher.on('add', (path) =>
      subject.next({
        key: join(documentDirectory, path),
        kind: 'update',
        hint: 'add',
        content: content(path),
      } as UpdateEvent<ContentSource, string>)
    )
    watcher.on('change', (path) =>
      subject.next({
        key: join(documentDirectory, path),
        kind: 'update',
        hint: 'update',
        content: content(path),
      } as UpdateEvent<ContentSource, string>)
    )
    watcher.on('addDir', (path) =>
      subject.next({
        key: join(documentDirectory, path),
        kind: 'update',
        hint: 'add',
        content: () => null,
      } as UpdateEvent<ContentSource, string>)
    )
    watcher.on('unlink', (path) =>
      subject.next({ key: join(documentDirectory, path), kind: 'delete' } as ChangeEvent<ContentSource, string>)
    )
    watcher.on('unlinkDir', (path) =>
      subject.next({ key: join(documentDirectory, path), kind: 'delete' } as ChangeEvent<ContentSource, string>)
    )
    watcher.on('error', (err) => {
      subject.error(err)
      watcher.close()
    })
    return subject
  }
}
