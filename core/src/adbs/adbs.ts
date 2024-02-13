import { inject, injectable, interfaces } from 'inversify'
import { merge } from 'rxjs'
import { DocumentLoader } from './documents/loader.js'
import { DocumentSource } from './documents/source.js'
import { DocumentStore } from './documents/store.js'
import { FileParser } from './file-parser/file-parser.js'
import { FileSource } from './file-source.js'
import { DocumentGraphMapper } from './graph/mapper.js'
import { GraphStore } from './graph/store.js'

@injectable()
export class ADBS {
  documentLoader: DocumentLoader
  documentStore: DocumentStore
  documentSource: DocumentSource
  constructor(
    @inject(FileSource)
    private fileSource: FileSource,
    @inject(FileParser)
    private fileParser: FileParser,
    @inject(DocumentLoader)
    private documentLoaderFactory: interfaces.SimpleFactory<DocumentLoader, [DocumentStore, string]>,
    @inject(DocumentStore)
    private documentStoreFactory: interfaces.SimpleFactory<DocumentStore, [string]>,
    @inject(DocumentGraphMapper) private documentGraphMapper: DocumentGraphMapper,
    @inject(GraphStore) private graphStore: GraphStore,
    @inject(DocumentSource) private documentSourceFactory: interfaces.SimpleFactory<DocumentSource, [DocumentStore]>
  ) {
    this.documentStore = this.documentStoreFactory('adbs')
    this.documentLoader = this.documentLoaderFactory(this.documentStore, 'adbs')
    this.documentSource = this.documentSourceFactory(this.documentStore)
  }

  public setupFileFlow(sourceFolders: string[]) {
    merge(...sourceFolders.map((folder) => this.fileSource.observe(folder)))
      .pipe(this.fileParser.parse())
      .subscribe(this.documentLoader.observer())
  }

  public setupGraphFlow() {
    this.documentSource.observable.pipe(this.documentGraphMapper.map()).subscribe(this.graphStore.observer)
  }
}
