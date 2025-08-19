import { ServiceIdentifier } from '@agrzes/yellow-next-plugin-core'

export const VITE_ROUTER = 'web.vite-router'

export interface WebEntrypoint {
  script: string
  root: string
}

export const WebEntrypoint: ServiceIdentifier<WebEntrypoint> = 'web.entrypoint'
