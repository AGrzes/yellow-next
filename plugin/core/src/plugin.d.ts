/**
 * Plugin context.
 * Passed to entrypoint function of the plugin to register services and perform other initialization tasks.
 */
export interface PluginContext {
  /**
   * Manifest based on which the plugin was loaded.
   * May be used to access plugin metadata or resolve paths to plugin resources.
   */
  manifest: PluginManifest
}

/**
 * Define plugin entry point - a function that initializes the plugin using the provided context.
 * The function is intentionally not async so complex initialization should be done lazily by service initializers only when the service is required.
 * Eager initialization is not recommended but can be done using top level async in plugin module.
 */
export type PluginEntrypoint = (params: PluginContext) => void
