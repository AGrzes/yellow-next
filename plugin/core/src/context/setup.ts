import { Container } from 'inversify'
import { lookupManifests } from '../index.js'
import { loadPlugin } from '../plugin-loader.js'
import { InversifyContext } from './inversify.js'
import { ApplicationContext } from './model.js'

export function createSetupContext(
  ContainerClass: typeof Container,
  InversifyContextClass: typeof InversifyContext,
  lookupManifestsRef: typeof lookupManifests,
  loadPluginRef: typeof loadPlugin
): () => Promise<ApplicationContext> {
  return async function setupContext(): Promise<ApplicationContext> {
    const container = new ContainerClass({ defaultScope: 'Singleton' })
    const context = new InversifyContextClass(container)
    const manifests = await lookupManifestsRef()
    for (const manifest of manifests) {
      const entrypoint = await loadPluginRef(manifest)
      entrypoint({ manifest, registry: context })
    }
    return context
  }
}
