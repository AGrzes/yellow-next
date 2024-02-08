import debug from 'debug'
import _ from 'lodash'
import { OperatorFunction, concatMap, mergeMap, of } from 'rxjs'
import { ChangeEvent, DeleteEvent, MoveEvent, UpdateEvent } from '../model.js'
import { Parsed, Parser } from './model.js'

const log = debug('yellow:adbs:file-parser')

export function parse(
  parsers: Parser[]
): OperatorFunction<ChangeEvent<void, string>, ChangeEvent<Record<string, any>, string>> {
  async function documentMapper(path: string): Promise<Parsed[]> {
    return _.flatten(
      await Promise.all(
        parsers.map(async (p) => {
          try {
            return await p.parse(path)
          } catch (e) {
            log('Error parsing file', e)
            return []
          }
        })
      )
    )
  }
  return (source) =>
    source.pipe(
      concatMap(async (event) => {
        log(`FileParser: ${event.key} ${event.kind}`)
        if (event.kind === 'update') {
          const { key, hint } = event as UpdateEvent<Record<string, any>, string>
          const parsed = await documentMapper(key)
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
