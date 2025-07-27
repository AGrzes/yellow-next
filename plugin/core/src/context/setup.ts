import { Container } from 'inversify'
import { lookupManifests } from '../index.js'
import { loadPlugin } from '../plugin-loader.js'
import { InversifyContext } from './inversify.js'
import { ApplicationContext } from './model.js'

export function createSetupContext(
  containerFactory: () => Container,
  inversifyContextFactory: (container: Container) => InversifyContext,
  lookupManifestsRef: typeof lookupManifests,
  loadPluginRef: typeof loadPlugin,
  extensions?: Array<(context: ApplicationContext) => void>
): () => Promise<ApplicationContext> {
  return async function setupContext(): Promise<ApplicationContext> {
    const container = containerFactory()
    const context = inversifyContextFactory(container)
    const manifests = await lookupManifestsRef()
    for (const manifest of manifests) {
      const entrypoint = await loadPluginRef(manifest)
      entrypoint({ manifest, registry: context })
    }
    extensions?.forEach((extension) => {
      extension(context)
    })
    return context
  }
}
