/**
 * Plugin context.
 * Passed to entrypoint function of the plugin to register services and perform other initialization tasks.
 */
export interface PluginContext {}

/**
 * Define plugin entry point - a function that initializes the plugin using the provided context.
 * The function is intentionally not async so complex initialization should be done lazily by service initializers only when the service is required.
 * Eager initialization is not recommended but can be done using top level async in plugin module.
 */
export type PluginEntrypoint = (params: PluginContext) => void
