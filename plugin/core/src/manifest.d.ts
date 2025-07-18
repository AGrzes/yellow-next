export interface PluginManifest {
  /**
   * The version of the plugin manifest format.
   */
  manifestVersion: string
  /**
   * The base URL for the plugin, used to resolve relative paths.
   * Should be set by plugin loader to the folder containing manifest unless the plugin sets it explicitly.
   */
  base: string
}

export interface PluginManifest_v1 extends PluginManifest {
  manifestVersion: '1'
  /**
   * The name of the plugin, used to identify it in the system.
   * It may contain lowercase letters, numbers, dashes, underscores and dots
   */
  name: string
  /**
   * The path to the plugin's entry point file, relative to the base URL.
   * This file should export a function that initializes the plugin.
   */
  entrypoint: string
}
