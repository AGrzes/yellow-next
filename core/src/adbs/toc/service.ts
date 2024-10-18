import debug from 'debug'
import matter from 'gray-matter'
import { injectable } from 'inversify'
import lodash from 'lodash'
import { basename, dirname, extname, join, relative, sep } from 'path'
import { PartialObserver } from 'rxjs'
import { ContentSource } from '../file-source.js'
import { ChangeEvent, MoveEvent, UpdateEvent } from '../model.js'

const { filter, groupBy, map, omit, startCase } = lodash

const log = debug('yellow:adbs:toc:service')

export interface TocNode {
  href?: string
  label: string
  children?: TocNode[]
}

interface Entry {
  path: string
  label?: string
  skip?: boolean
}
@injectable()
export class TocService {
  constructor(private documentDirectory: string = 'documents') {}
  private buildToc(): TocNode[] {
    log('buildToc', this.entries)
    const mapLeafEntryToNode = ({ label, path, skip }: Entry): TocNode => (skip ? null : { label, href: path })
    const createJunctionNode = (children: Array<Entry & { segments: string[] }>, segment: string): TocNode => {
      const mappedChildren = processTocLevel(
        map(children, (child) => ({
          ...child,
          segments: child.segments.length > 1 ? child.segments.slice(1) : ['.'],
        }))
      )
      if (mappedChildren.length) {
        return {
          label: startCase(segment),
          children: mappedChildren,
        }
      } else {
        return null
      }
    }
    const processTocLevel = (items: Array<Entry & { segments: string[] }>): TocNode[] => {
      const groups = groupBy(items, ({ segments }) => segments[0])
      return filter([...map(groups['.'], mapLeafEntryToNode), ...map(omit(groups, '.'), createJunctionNode)])
    }

    return processTocLevel(
      map(this.entries, (cache, path) => ({
        ...cache,
        segments: dirname(path).split(sep),
      }))
    )
  }

  private tocCache: TocNode[]
  private entries: Record<string, Entry> = {}

  private async extractMetadata(path: string, source: ContentSource): Promise<Record<string, any>> {
    log('extractMetadata', path)
    const ext = extname(path)
    if (['.mdx', '.md'].includes(ext)) {
      const content = await source()
      const metadata = matter(content).data
      log('extractMetadata', metadata)
      return metadata
    }
    return {}
  }

  private async createEntry(path: string, source: ContentSource): Promise<Entry> {
    const dir = dirname(path)
    const ext = extname(path)
    const base = basename(path, ext)
    const { title } = await this.extractMetadata(path, source)
    return {
      path: join(dir, base),
      label: title || startCase(base),
      skip: !['.mdx', '.md', '.tsx', '.jsx'].includes(ext),
    }
  }

  private async addEntry(path: string, source: ContentSource): Promise<void> {
    this.entries[path] = await this.createEntry(path, source)
  }
  private async removeEntry(path: string): Promise<void> {
    delete this.entries[path]
  }
  private async moveEntry(oldPath: string, newPath: string): Promise<void> {
    const dir = dirname(newPath)
    const ext = extname(newPath)
    const base = basename(newPath, ext)
    this.entries[newPath] = this.entries[oldPath]
    this.entries[newPath].path = join(dir, base)
    delete this.entries[oldPath]
  }

  public get observer(): PartialObserver<ChangeEvent<ContentSource, string>> {
    return {
      next: async (change) => {
        try {
          const path = relative(this.documentDirectory, change.key)
          switch (change.kind) {
            case 'update':
              await this.addEntry(path, (change as UpdateEvent<ContentSource, string>).content)
              break
            case 'delete':
              await this.removeEntry(path)
              break
            case 'move':
              await this.moveEntry(path, relative(this.documentDirectory, (change as MoveEvent<void, string>).newKey))
              break
          }
        } catch (e) {
          log('Tos update failure', e)
        }
        this.tocCache = null
      },
    }
  }

  public get toc(): TocNode[] {
    if (!this.tocCache) {
      this.tocCache = this.buildToc()
    }
    return this.tocCache
  }
}
