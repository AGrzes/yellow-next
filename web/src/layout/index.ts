import { createContext, useContext } from 'react'

const PrintContext = createContext(false)

export const usePrint = () => {
  return useContext(PrintContext)
}

export const PrintProvider = PrintContext.Provider
