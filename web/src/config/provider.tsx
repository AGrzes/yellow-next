import React from 'react'
import { Config, ConfigContext, config } from './index'

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [c, setConfig] = React.useState<Config>(null)
  React.useEffect(() => {
    config().then(setConfig)
  }, [])
  return <ConfigContext.Provider value={c}>{c && children}</ConfigContext.Provider>
}
