import debug from 'debug'
import { injectable, multiInject } from 'inversify'
import _ from 'lodash'
import { OperatorFunction, concatMap, mergeMap, of } from 'rxjs'
import { ContentSource } from '../file-source.js'
import { ChangeEvent, DeleteEvent, MoveEvent, UpdateEvent } from '../model.js'
import { Parsed, Parser } from './model.js'

const log = debug('yellow:adbs:file-parser')
@injectable()
export class FileParser {
  constructor(@multiInject(Parser) private parsers: Parser[]) {}
  private async documentMapper(path: string, source: ContentSource): Promise<Parsed[]> {
    return _.flatten(
      await Promise.all(
        this.parsers.map(async (p) => {
          try {
            return await p.parse(path, source)
          } catch (e) {
            log('Error parsing file', e)
            return []
          }
        })
      )
    )
  }
  public parse(): OperatorFunction<ChangeEvent<ContentSource, string>, ChangeEvent<Record<string, any>, string>> {
    {
      return (source) =>
        source.pipe(
          concatMap(async (event) => {
            log(`FileParser: ${event.key} ${event.kind}`)
            if (event.kind === 'update') {
              const { key, hint, content } = event as UpdateEvent<ContentSource, string>
              const parsed = await this.documentMapper(key, content)
              return _.map(
                parsed,
                ({ document, id }) =>
                  ({
                    key: `${event.key}#${id}`,
                    kind: 'update',
                    content: document,
                    hint,
                  }) as UpdateEvent<Record<string, any>, string>
              )
            } else if (event.kind === 'delete') {
              return [
                {
                  key: event.key,
                  kind: 'delete',
                } as DeleteEvent<Record<string, any>, string>,
              ]
            } else if (event.kind === 'move') {
              const { newKey } = event as MoveEvent<Record<string, any>, string>
              return [
                {
                  key: event.key,
                  kind: 'move',
                  newKey,
                } as MoveEvent<Record<string, any>, string>,
              ]
            }
          }),
          mergeMap((x) => of(...x))
        )
    }
  }
}
