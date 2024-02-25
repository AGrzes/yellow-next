import 'mocha'

import { expect } from 'chai'

import { MoveEvent } from '../../../src/adbs/model'
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
        await tocService.observer.next!({ key: 'documents/file.md', kind: 'update' })
        const toc = tocService.toc
        expect(toc).to.deep.equal([
          {
            label: 'File',
            href: 'file.md',
          },
        ])
      })
      it('should list folder with subfolder', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({ key: 'documents/folder/file.md', kind: 'update' })
        const toc = tocService.toc
        expect(toc).to.deep.equal([
          {
            label: 'Folder',
            children: [
              {
                label: 'File',
                href: 'folder/file.md',
              },
            ],
          },
        ])
      })
      it('should handle deep folder', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({ key: 'documents/folder/subfolder/file.md', kind: 'update' })
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
                    href: 'folder/subfolder/file.md',
                  },
                ],
              },
            ],
          },
        ])
      })
      it('should handle file deletion', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({ key: 'documents/folder/file.md', kind: 'update' })
        await tocService.observer.next!({ key: 'documents/folder/file.md', kind: 'delete' })
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
      it('should handle file move', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({ key: 'documents/folder/file.md', kind: 'update' })
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
                href: 'folder/new.md',
              },
            ],
          },
        ])
      })
      it('should handle entry errors', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({ key: 0 as unknown as string, kind: 'update' })
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
      it('should handle skipped file types', async () => {
        const tocService = new TocService()
        await tocService.observer.next!({ key: 'documents/file.txt', kind: 'update' })
        const toc = tocService.toc
        expect(toc).to.deep.equal([])
      })
    })
  })
})
