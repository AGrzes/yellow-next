import { Container } from 'inversify'
import { lookupManifests } from '../index.js'
import { loadPlugin } from '../plugin-loader.js'
import { InversifyContext } from './inversify.js'
import { ApplicationContext } from './model.js'
export * from './lifecycle.js'
export * from './model.js'

export async function setupContext(): Promise<ApplicationContext> {
  const container = new Container({ defaultScope: 'Singleton' })
  const context = new InversifyContext(container)
  const manifests = await lookupManifests()
  for (const manifest of manifests) {
    const entrypoint = await loadPlugin(manifest)
    entrypoint({ manifest, registry: context })
  }
  return context
}
