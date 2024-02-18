/* c8 ignore start */
import { watch } from 'chokidar'
import { Router } from 'express'
import { readFile } from 'fs/promises'
import { ContainerModule } from 'inversify'
import { ADBS } from './adbs.js'
import { DocumentLoader, documentLoaderFactory } from './documents/loader.js'
import { DocumentsHandler } from './documents/server.js'
import { DocumentSource, documentSourceFactory } from './documents/source.js'
import { DocumentStore, documentStoreFactory } from './documents/store.js'
import { FileParser } from './file-parser/file-parser.js'
import { FrontmatterParser } from './file-parser/frontmatter-parser.js'
import { Parser, Read } from './file-parser/model.js'
import { YamlParser } from './file-parser/yaml-parser.js'
import { FileSource } from './file-source.js'
import { DocumentGraphMapper, JSONLDMapping, Mapping } from './graph/mapper.js'
import { GraphHandler } from './graph/server.js'
import { GraphStore } from './graph/store.js'

export const adbsModule = new ContainerModule((bind) => {
  bind(watch).toConstantValue(watch)
  bind(FileSource).toSelf().inSingletonScope()
  bind(DocumentStore).toFactory(() => documentStoreFactory)
  bind(DocumentLoader).toFactory(() => documentLoaderFactory)
  bind(FileParser).toSelf().inSingletonScope()
  bind(YamlParser).toSelf().inSingletonScope()
  bind(FrontmatterParser).toSelf().inSingletonScope()
  bind(Parser).toService(YamlParser)
  bind(Parser).toService(FrontmatterParser)
  bind(ADBS).toSelf().inSingletonScope()
  bind(Read).toConstantValue((path) => readFile(path, 'utf-8'))
  bind(DocumentGraphMapper).toSelf().inSingletonScope()
  bind(Mapping)
    .toDynamicValue((context) => JSONLDMapping('graph'))
    .inSingletonScope()
  bind(DocumentSource).toFactory(() => documentSourceFactory)
  bind(GraphStore).toSelf().inSingletonScope()
  bind(GraphHandler).toDynamicValue(
    (context) => new GraphHandler(context.container.get(GraphStore).observableStore, Router())
  )
  bind(DocumentsHandler).toDynamicValue((context) => new DocumentsHandler(Router()))
})
