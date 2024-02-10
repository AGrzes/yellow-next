import debug from 'debug'
import _ from 'lodash'
import { ReplaySubject } from 'rxjs'
import { ChangeEvent, UpdateEvent } from '../model.js'
const log = debug('yellow:adbs:document:source')

export class DocumentSource {
  constructor(private database: PouchDB.Database) {}
  get observable() {
    const subject = new ReplaySubject<ChangeEvent<any, string>>()
    this.database
      .changes({ include_docs: true, live: true })
      .on('change', (change) => {
        log(`change ${change.id}`)
        if (change.deleted) {
          subject.next({ kind: 'delete', key: change.id })
        } else {
          subject.next({ kind: 'update', key: change.id, content: _.omit(change.doc, '_id', '_rev') } as UpdateEvent<
            any,
            string
          >)
        }
      })
      .on('complete', () => {
        log(`complete`)
        subject.complete()
      })
      .on('error', (error) => {
        log(`error`)
        subject.error(error)
      })
    return subject
  }
}
