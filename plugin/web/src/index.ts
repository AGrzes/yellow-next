import { ServiceIdentifier } from '@agrzes/yellow-next-plugin-core'
import { Plugin } from 'vite'

export const VITE_ROUTER = 'web.vite-router'

export const VITE_PLUGIN: ServiceIdentifier<Plugin> = 'web.vite-plugin'

export interface WebEntrypoint {
  script: string
  root: string
}

export const WebEntrypoint: ServiceIdentifier<WebEntrypoint> = 'web.entrypoint'
