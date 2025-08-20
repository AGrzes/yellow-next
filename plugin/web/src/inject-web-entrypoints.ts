import { HtmlTagDescriptor, Plugin } from 'vite'
import { WebEntrypoint } from './index.js'

export function injectWebEntrypoints(entrypoints: WebEntrypoint[]): Plugin {
  return {
    name: 'inject-web-entrypoints',
    enforce: 'pre',
    config(old) {
      return {
        server: { fs: { allow: [...(old?.server?.fs?.allow || []), ...entrypoints.map((e) => e.root)] } },
      }
    },
    transformIndexHtml(html) {
      const tags = entrypoints.map(
        (e): HtmlTagDescriptor => ({
          tag: 'script',
          attrs: { type: 'module', src: `/@fs${e.script.replace(/\\/g, '/')}` },
          injectTo: 'body',
        })
      )
      return { html, tags }
    },
  }
}
