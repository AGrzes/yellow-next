import PouchDB from 'pouchdb'
import pouchDbAdapterHttp from 'pouchdb-adapter-http'
import React from 'react'
import { Store } from '../service/store/index.js'
import { PouchDBMetadata, PouchDBReference, PouchDBStore } from '../service/store/pouchdb'

PouchDB.plugin(pouchDbAdapterHttp)

interface StoreContextValue {
  store: Store<PouchDBMetadata, PouchDBReference>
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

export function useStore() {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

declare global {
  interface Window {
    config: {
      couchdb_url: string
    }
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = React.useState<Store<PouchDBMetadata, PouchDBReference> | null>(null)

  React.useEffect(() => {
    const db = new PouchDB(window.config.couchdb_url)
    setStore(new PouchDBStore(db))
  }, [])

  if (!store) {
    return null
  }

  return <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
}
