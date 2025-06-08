/* c8 ignore start */
import { watch } from 'chokidar'
import { Router } from 'express'
import fs, { readFile } from 'fs/promises'
import { ContainerModule } from 'inversify'
import { ADBS } from './adbs.js'
import { DocumentHandler, HandlerAggregator } from './documents/handler.js'
import { FrontmatterHandler } from './documents/handlers/frontmatter.js'
import { DocumentLoader, documentLoaderFactory } from './documents/loader.js'
import { DocumentsHandler } from './documents/server.js'
import { DocumentSource, documentSourceFactory } from './documents/source.js'
import { DocumentStore, documentStoreFactory } from './documents/store.js'
import { FileParser } from './file-parser/file-parser.js'
import { FrontmatterParser } from './file-parser/frontmatter-parser.js'
import { Parser } from './file-parser/model.js'
import { ScriptParser } from './file-parser/script-parser.js'
import { YamlParser } from './file-parser/yaml-parser.js'
import { FileSource } from './file-source.js'
import { DocumentGraphMapper, DynamicSemanticMapping, JSONLDMapping, Mapping } from './graph/mapper.js'
import { GraphHandler } from './graph/server.js'
import { GraphStore } from './graph/store.js'
import { TocHandler } from './toc/server.js'
import { TocService } from './toc/service.js'

export const adbsModule = new ContainerModule((bind) => {
  bind(watch).toConstantValue(watch)
  bind(FileSource).toSelf().inSingletonScope()
  bind(DocumentStore).toFactory(() => documentStoreFactory)
  bind(DocumentLoader).toFactory(() => documentLoaderFactory)
  bind(FileParser).toSelf().inSingletonScope()
  bind(YamlParser).toSelf().inSingletonScope()
  bind(ScriptParser).toSelf().inSingletonScope()
  bind(FrontmatterParser).toSelf().inSingletonScope()
  bind(Parser).toService(YamlParser)
  bind(Parser).toService(FrontmatterParser)
  bind(Parser).toService(ScriptParser)
  bind(ADBS).toSelf().inSingletonScope()
  bind(readFile).toConstantValue((path) => readFile(path, 'utf-8'))
  bind(DocumentGraphMapper).toSelf().inSingletonScope()
  bind(Mapping)
    .toDynamicValue((context) => JSONLDMapping('graph'))
    .inSingletonScope()
  bind(Mapping)
    .toDynamicValue((context) => DynamicSemanticMapping(context.container.get(GraphStore).observableStore))
    .inSingletonScope()
  bind(DocumentSource).toFactory(() => documentSourceFactory)
  bind(GraphStore).toSelf().inSingletonScope()
  bind(GraphHandler).toDynamicValue(
    (context) => new GraphHandler(context.container.get(GraphStore).observableStore, Router())
  )
  bind(DocumentsHandler).toDynamicValue(
    (context) => new DocumentsHandler(Router(), context.container.get(HandlerAggregator))
  )
  bind(TocService).toSelf().inSingletonScope()
  bind(TocHandler).toDynamicValue((context) => new TocHandler(context.container.get(TocService), Router()))
  bind(HandlerAggregator).toDynamicValue(
    (context) => new HandlerAggregator(context.container.getAll(DocumentHandler), Router())
  )
  bind(FrontmatterHandler).toDynamicValue((context) => new FrontmatterHandler('documents', fs))
  bind(DocumentHandler).toService(FrontmatterHandler)
})
