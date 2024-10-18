import 'mocha'

import { expect } from 'chai'

import { ContentSource } from '../../../src/adbs/file-source'
import { MoveEvent, UpdateEvent } from '../../../src/adbs/model'
import { TocService } from '../../../src/adbs/toc/service'

describe('adbs', () => {
  describe('toc', () => {
    describe('TocService', () => {
      it('should build toc', async () => {
        const tocService = new TocService()
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
      it('should list simple folder', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/file.md',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([
          {
            label: 'File',
            href: 'file',
          },
        ])
      })
      it('should list folder with subfolder', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/folder/file.md',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([
          {
            label: 'Folder',
            children: [
              {
                label: 'File',
                href: 'folder/file',
              },
            ],
          },
        ])
      })
      it('should handle deep folder', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/folder/subfolder/file.md',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([
          {
            label: 'Folder',
            children: [
              {
                label: 'Subfolder',
                children: [
                  {
                    label: 'File',
                    href: 'folder/subfolder/file',
                  },
                ],
              },
            ],
          },
        ])
      })
      it('should handle file deletion', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/folder/file.md',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        await tocService.observer.next!({ key: 'documents/folder/file.md', kind: 'delete' })
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
      it('should handle file move', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/folder/file.md',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        await tocService.observer.next!({
          key: 'documents/folder/file.md',
          kind: 'move',
          newKey: 'documents/folder/new.md',
        } as MoveEvent<void, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([
          {
            label: 'Folder',
            children: [
              {
                label: 'File',
                href: 'folder/new',
              },
            ],
          },
        ])
      })
      it('should handle entry errors', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 0 as unknown as string,
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
      it('should handle skipped file types', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/file.txt',
          kind: 'update',
          //content: async () => '',
        } as UpdateEvent<any, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
      it('should skip empty folders', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/folder/',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        await tocService.observer.next!({
          key: 'documents/folder/subfolder/',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
      it('should handle index documents', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/folder/index.md',
          kind: 'update',
          content: async () => `---
index: true
---
          `,
        } as UpdateEvent<ContentSource, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([{ label: 'Folder', href: 'folder/index' }])
      })
      it('should handle index documents with children', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({
          key: 'documents/folder/index.md',
          kind: 'update',
          content: async () => `---
index: true
---`,
        } as UpdateEvent<ContentSource, string>)
        await tocService.observer.next!({
          key: 'documents/folder/file.md',
          kind: 'update',
          content: async () => '',
        } as UpdateEvent<ContentSource, string>)
        const toc = tocService.toc
        expect(toc).to.deep.equal([
          { label: 'Folder', href: 'folder/index', children: [{ label: 'File', href: 'folder/file' }] },
        ])
      })
    })
  })
})
