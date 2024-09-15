import { useMemo, useState } from 'react'

export function useSessionState(key: string, initialValue: any) {
  const [state, setState] = useState(() => {
    const value = sessionStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
    return initialValue
  })
  const setSessionState = useMemo(
    () => (value: any) => {
      setState(value)
      sessionStorage.setItem(key, JSON.stringify(value))
    },
    [setState]
  )
  return [state, setSessionState]
}
