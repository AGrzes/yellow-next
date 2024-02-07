import { watch } from 'chokidar'
import { inject, injectable } from 'inversify'
import { Observable, Subject } from 'rxjs'
import { ChangeEvent, UpdateEvent } from './model.js'

@injectable()
export class FileSource {
  constructor(@inject(watch) private createWatcher: typeof watch) {}

  observe(documentDirectory: string): Observable<ChangeEvent<void, string>> {
    const subject = new Subject<ChangeEvent<void, string>>()
    const watcher = this.createWatcher('.', { cwd: documentDirectory })

    watcher.on('add', (path) => subject.next({ key: path, kind: 'update', hint: 'add' } as UpdateEvent<void, string>))
    watcher.on('change', (path) =>
      subject.next({ key: path, kind: 'update', hint: 'update' } as UpdateEvent<void, string>)
    )
    watcher.on('addDir', (path) =>
      subject.next({ key: path, kind: 'update', hint: 'add' } as UpdateEvent<void, string>)
    )
    watcher.on('unlink', (path) => subject.next({ key: path, kind: 'delete' } as ChangeEvent<void, string>))
    watcher.on('unlinkDir', (path) => subject.next({ key: path, kind: 'delete' } as ChangeEvent<void, string>))
    watcher.on('error', (err) => {
      subject.error(err)
      watcher.close()
    })
    return subject
  }
}
