import jsonld from 'jsonld'
import { Store } from 'n3'
import React from 'react'

export const StoreContext: React.Context<Store> = React.createContext<Store>(undefined)

export async function loadGraph(): Promise<Store> {
  return new Store((await jsonld.toRDF(await (await fetch('/graph')).json())) as any)
}

export function useStore(): Store {
  return React.useContext(StoreContext)
}
