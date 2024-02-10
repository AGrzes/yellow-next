import { inject, injectable, interfaces } from 'inversify'
import { merge } from 'rxjs'
import { DocumentLoader } from './documents/loader.js'
import { DocumentStore } from './documents/store.js'
import { FileParser } from './file-parser/file-parser.js'
import { FileSource } from './file-source.js'

@injectable()
export class ADBS {
  documentLoader: DocumentLoader
  documentStore: DocumentStore
  constructor(
    @inject(FileSource)
    private fileSource: FileSource,
    @inject(FileParser)
    private fileParser: FileParser,
    @inject(DocumentLoader)
    private documentLoaderFactory: interfaces.SimpleFactory<DocumentLoader, [DocumentStore, string]>,
    @inject(DocumentStore)
    private documentStoreFactory: interfaces.SimpleFactory<DocumentStore, [string]>
  ) {
    this.documentStore = this.documentStoreFactory('adbs')
    this.documentLoader = this.documentLoaderFactory(this.documentStore, 'adbs')
  }

  public setupFileFlow(sourceFolders: string[]) {
    merge(...sourceFolders.map((folder) => this.fileSource.observe(folder)))
      .pipe(this.fileParser.parse())
      .subscribe(this.documentLoader.observer())
  }
}
