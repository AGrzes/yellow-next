import { PartialObserver } from 'rxjs'
import { ChangeEvent, MoveEvent, UpdateEvent } from '../model.js'

export class DocumentLoaderService {
  constructor(
    private database: PouchDB.Database,
    private instance: string
  ) {}

  private async merge<T extends { _id: string; _rev?: string }>(doc: T) {
    try {
      await this.database.put(doc)
    } catch (e) {
      if (e.name === 'conflict') {
        const { _rev } = await this.database.get(doc._id)
        await this.merge({ ...doc, _rev })
      } else {
        throw e
      }
    }
  }

  private async delete(id: string) {
    const docs = await this.database.allDocs({ startkey: id, endkey: id + '\uffff' })
    await Promise.all(
      docs.rows.map(async (doc) => {
        try {
          await this.database.remove(doc.id, doc.value.rev)
        } catch (e) {
          if (e.name === 'conflict') {
            // Ignore Delete Conflicts
          } else {
            throw e
          }
        }
      })
    )
  }

  private async move(key: string, newKey: string) {
    const id = `document:${this.instance}:${key}`
    const newId = `document:${this.instance}:${newKey}`
    const docs = await this.database.allDocs({ startkey: id, endkey: id + '\uffff', include_docs: true })
    await Promise.all(
      docs.rows.map(async (doc) => {
        await this.merge({
          ...doc.doc,
          _id: doc.id.replace(key, newKey),
          instance: this.instance,
          path: newKey,
        })
        await this.database.remove(doc.id, doc.value.rev)
      })
    )
  }

  public observer(): PartialObserver<ChangeEvent<Record<string, any>, string>> {
    return {
      next: async (change) => {
        const id = `document:${this.instance}:${change.key}`
        switch (change.kind) {
          case 'update':
            const { key: path, content } = change as UpdateEvent<Record<string, any>, string>
            await this.merge({
              _id: id,
              instance: this.instance,
              path,
              ...content,
            })
            break
          case 'delete':
            await this.delete(id)
            break
          case 'move':
            const { newKey } = change as MoveEvent<Record<string, any>, string>
            await this.move(change.key, newKey)
            break
        }
      },
    }
  }
}
